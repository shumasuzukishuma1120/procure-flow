package com.example.procureflow.purchase.application;

import com.example.procureflow.common.error.ApiException;
import com.example.procureflow.purchase.infrastructure.PurchaseDetailRow;
import com.example.procureflow.purchase.infrastructure.PurchaseItemRow;
import com.example.procureflow.purchase.infrastructure.PurchaseQueryMapper;
import com.example.procureflow.purchase.infrastructure.PurchaseSearchCriteria;
import com.example.procureflow.purchase.presentation.dto.PurchaseDetailResponse;
import com.example.procureflow.purchase.presentation.dto.PurchaseDepartmentResponse;
import com.example.procureflow.purchase.presentation.dto.PurchaseItemResponse;
import com.example.procureflow.purchase.presentation.dto.PurchaseListItemResponse;
import com.example.procureflow.purchase.presentation.dto.PurchaseListResponse;
import com.example.procureflow.request.domain.RequestStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.DateTimeException;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PurchaseQueryService {
    private static final Set<Integer> ALLOWED_PAGE_SIZES = Set.of(20, 50, 100);
    private static final Set<RequestStatus> ALLOWED_STATUSES = Set.of(
            RequestStatus.APPROVED, RequestStatus.ORDERED, RequestStatus.COMPLETED
    );
    private static final ZoneId BUSINESS_ZONE = ZoneId.of("Asia/Tokyo");
    private final PurchaseQueryMapper mapper;
    private final Clock clock;

    @Transactional(readOnly = true)
    public PurchaseListResponse findAll(int page, int size, String sort, String status,
                                        String keyword, UUID departmentId, UUID supplierId,
                                        LocalDate approvedFrom, LocalDate approvedTo) {
        if (page < 0 || !ALLOWED_PAGE_SIZES.contains(size)) {
            throw invalidQuery("pageまたはsizeの指定が不正です。");
        }
        if (approvedFrom != null && approvedTo != null && approvedFrom.isAfter(approvedTo)) {
            throw invalidQuery("approvedFromはapprovedTo以前の日付を指定してください。");
        }
        RequestStatus parsedStatus = parseStatus(status);
        LocalDate today = LocalDate.now(clock.withZone(BUSINESS_ZONE));
        PurchaseSearchCriteria criteria = new PurchaseSearchCriteria(
                parsedStatus, normalizeKeyword(keyword), departmentId, supplierId,
                approvedFrom == null ? null : approvedFrom.atStartOfDay(BUSINESS_ZONE).toInstant(),
                toExclusiveInstant(approvedTo), parseSort(sort), size,
                Math.multiplyExact((long) page, size)
        );
        long total = mapper.count(criteria);
        int totalPages = total == 0 ? 0 : Math.toIntExact((total + size - 1) / size);
        List<PurchaseListItemResponse> items = mapper.findAll(criteria).stream()
                .map(row -> new PurchaseListItemResponse(
                        row.requestId(), row.requestNumber(), row.title(), row.status(),
                        row.applicantName(), row.departmentId(), row.departmentName(),
                        row.itemSummary(), row.additionalItemCount(), row.supplierId(),
                        row.supplierName(), row.totalAmount(), row.approvedAt(),
                        row.desiredDeliveryDate(), row.desiredDeliveryDate() != null
                                && row.desiredDeliveryDate().isBefore(today), row.version()))
                .toList();
        return new PurchaseListResponse(items, page, size, total, totalPages);
    }

    @Transactional(readOnly = true)
    public PurchaseDetailResponse findById(UUID requestId) {
        PurchaseDetailRow row = mapper.findDetail(requestId);
        if (row == null) {
            throw new ApiException(HttpStatus.NOT_FOUND, "PURCHASE_REQUEST_NOT_FOUND",
                    "対象の購買申請が見つかりません。");
        }
        List<PurchaseItemResponse> items = mapper.findItems(requestId).stream()
                .map(this::toItemResponse).toList();
        long approvedTotal = items.stream().mapToLong(PurchaseItemResponse::plannedAmount).sum();
        Long actualTotal = row.purchaseOrderId() == null ? null
                : items.stream().mapToLong(item -> item.actualAmount()).sum();
        return new PurchaseDetailResponse(
                row.requestId(), row.requestNumber(), row.status(), row.title(), row.reason(),
                row.desiredDeliveryDate(), row.note(), row.applicantId(), row.applicantName(),
                row.departmentId(), row.departmentName(), row.requestedSupplierId(),
                row.requestedSupplierName(), items, approvedTotal, actualTotal, row.approvedAt(),
                row.purchaseOrderId(), row.actualSupplierId(), row.actualSupplierName(),
                row.purchaseOrderNumber(), row.promisedDeliveryDate(), row.purchaserNote(),
                row.orderedByName(), row.orderedAt(), row.receivedDate(), row.receiptNote(),
                row.receivedByName(), row.completedAt(), row.version());
    }

    @Transactional(readOnly = true)
    public List<PurchaseDepartmentResponse> findActiveDepartments() {
        return mapper.findActiveDepartments();
    }

    private PurchaseItemResponse toItemResponse(PurchaseItemRow row) {
        long planned = Math.multiplyExact(row.quantity(), row.plannedUnitPrice());
        Long actual = row.actualUnitPrice() == null ? null
                : Math.multiplyExact(row.quantity(), row.actualUnitPrice());
        return new PurchaseItemResponse(row.requestItemId(), row.lineNumber(), row.productName(),
                row.modelNumber(), row.productUrl(), row.categoryId(), row.categoryName(),
                row.quantity(), row.plannedUnitPrice(), row.actualUnitPrice(), planned, actual);
    }

    private RequestStatus parseStatus(String status) {
        if (status == null || status.isBlank()) return null;
        try {
            RequestStatus parsed = RequestStatus.valueOf(status.trim().toUpperCase(Locale.ROOT));
            if (!ALLOWED_STATUSES.contains(parsed)) throw new IllegalArgumentException();
            return parsed;
        } catch (IllegalArgumentException exception) {
            throw invalidQuery("statusに指定できない値が含まれています。");
        }
    }

    private PurchaseSort parseSort(String sort) {
        if (sort == null || sort.isBlank()) return PurchaseSort.DELIVERY_DATE_ASC;
        try {
            return PurchaseSort.valueOf(sort.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException exception) {
            throw invalidQuery("sortに指定できない値が含まれています。");
        }
    }

    private String normalizeKeyword(String keyword) {
        if (keyword == null || keyword.isBlank()) return null;
        String value = keyword.trim();
        if (value.length() > 100) throw invalidQuery("keywordは100文字以内で指定してください。");
        return value.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_");
    }

    private java.time.Instant toExclusiveInstant(LocalDate date) {
        if (date == null) return null;
        try {
            return date.plusDays(1).atStartOfDay(BUSINESS_ZONE).toInstant();
        } catch (DateTimeException exception) {
            throw invalidQuery("approvedToに指定できない日付が含まれています。");
        }
    }

    private ApiException invalidQuery(String message) {
        return new ApiException(HttpStatus.BAD_REQUEST, "INVALID_QUERY_PARAMETER", message);
    }
}
