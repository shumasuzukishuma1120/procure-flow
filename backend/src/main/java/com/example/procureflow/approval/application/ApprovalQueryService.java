package com.example.procureflow.approval.application;

import com.example.procureflow.approval.infrastructure.ApprovalDetailRow;
import com.example.procureflow.approval.infrastructure.ApprovalItemRow;
import com.example.procureflow.approval.infrastructure.ApprovalListItemRow;
import com.example.procureflow.approval.infrastructure.ApprovalQueryMapper;
import com.example.procureflow.approval.infrastructure.ApprovalSearchCriteria;
import com.example.procureflow.approval.presentation.dto.ApprovalDecisionResponse;
import com.example.procureflow.approval.presentation.dto.ApprovalDetailResponse;
import com.example.procureflow.approval.presentation.dto.ApprovalItemResponse;
import com.example.procureflow.approval.presentation.dto.ApprovalListItemResponse;
import com.example.procureflow.approval.presentation.dto.ApprovalListResponse;
import com.example.procureflow.approval.presentation.dto.ApproverDepartmentResponse;
import com.example.procureflow.common.error.ApiException;
import com.example.procureflow.security.CurrentUser;
import com.example.procureflow.security.CurrentUserProvider;
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
public class ApprovalQueryService {

    private static final Set<Integer> ALLOWED_PAGE_SIZES = Set.of(20, 50, 100);
    private static final int MAX_KEYWORD_LENGTH = 100;
    private static final ZoneId BUSINESS_ZONE = ZoneId.of("Asia/Tokyo");

    private final CurrentUserProvider currentUserProvider;
    private final ApprovalQueryMapper approvalQueryMapper;
    private final Clock clock;

    @Transactional(readOnly = true)
    public ApprovalListResponse findAll(
            int page,
            int size,
            String keyword,
            LocalDate submittedFrom,
            LocalDate submittedTo,
            UUID departmentId,
            boolean overdueOnly,
            String sort
    ) {
        validatePage(page, size);
        validateDateRange(submittedFrom, submittedTo);

        CurrentUser currentUser = currentUserProvider.getCurrentUser();
        LocalDate businessDate = LocalDate.now(clock.withZone(BUSINESS_ZONE));
        ApprovalSearchCriteria criteria = new ApprovalSearchCriteria(
                currentUser.id(),
                normalizeKeyword(keyword),
                submittedFrom == null
                        ? null
                        : submittedFrom.atStartOfDay(BUSINESS_ZONE).toInstant(),
                toExclusiveInstant(submittedTo),
                departmentId,
                overdueOnly ? businessDate : null,
                parseSort(sort),
                size,
                Math.multiplyExact((long) page, size)
        );

        long totalElements = approvalQueryMapper.count(criteria);
        int totalPages = totalElements == 0
                ? 0
                : Math.toIntExact((totalElements + size - 1) / size);

        return new ApprovalListResponse(
                approvalQueryMapper.findAll(criteria).stream()
                        .map(row -> toListItemResponse(row, businessDate))
                        .toList(),
                page,
                size,
                totalElements,
                totalPages
        );
    }

    @Transactional(readOnly = true)
    public ApprovalDetailResponse findById(UUID requestId) {
        CurrentUser currentUser = currentUserProvider.getCurrentUser();
        ApprovalDetailRow request = approvalQueryMapper.findDetail(
                requestId,
                currentUser.id()
        );
        if (request == null) {
            throw new ApiException(
                    HttpStatus.NOT_FOUND,
                    "APPROVAL_REQUEST_NOT_FOUND",
                    "対象の承認申請が見つかりません。"
            );
        }

        List<ApprovalItemResponse> items = approvalQueryMapper.findItems(
                        requestId,
                        currentUser.id()
                ).stream()
                .map(this::toItemResponse)
                .toList();

        return new ApprovalDetailResponse(
                request.requestId(),
                request.requestNumber(),
                request.status(),
                request.title(),
                request.reason(),
                request.desiredDeliveryDate(),
                request.requestedSupplierId(),
                request.requestedSupplierName(),
                request.note(),
                request.applicantId(),
                request.applicantName(),
                request.departmentId(),
                request.departmentName(),
                items,
                calculateTotalAmount(items),
                request.version(),
                request.submittedAt(),
                request.createdAt(),
                request.updatedAt(),
                toDecisionResponse(request)
        );
    }

    @Transactional(readOnly = true)
    public List<ApproverDepartmentResponse> findApproverDepartments() {
        CurrentUser currentUser = currentUserProvider.getCurrentUser();
        return approvalQueryMapper.findApproverDepartments(currentUser.id()).stream()
                .map(row -> new ApproverDepartmentResponse(row.id(), row.name()))
                .toList();
    }

    private ApprovalListItemResponse toListItemResponse(
            ApprovalListItemRow row,
            LocalDate businessDate
    ) {
        return new ApprovalListItemResponse(
                row.requestId(),
                row.requestNumber(),
                row.title(),
                row.status(),
                row.applicantName(),
                row.departmentId(),
                row.departmentName(),
                row.requestedSupplierName(),
                row.totalAmount(),
                row.desiredDeliveryDate(),
                row.desiredDeliveryDate() != null
                        && row.desiredDeliveryDate().isBefore(businessDate),
                row.submittedAt(),
                row.version()
        );
    }

    private ApprovalItemResponse toItemResponse(ApprovalItemRow row) {
        long amount = row.quantity() == null || row.plannedUnitPrice() == null
                ? 0
                : Math.multiplyExact(row.quantity().longValue(), row.plannedUnitPrice());
        return new ApprovalItemResponse(
                row.lineNumber(),
                row.productName(),
                row.modelNumber(),
                row.productUrl(),
                row.categoryId(),
                row.categoryName(),
                row.quantity(),
                row.plannedUnitPrice(),
                amount
        );
    }

    private ApprovalDecisionResponse toDecisionResponse(ApprovalDetailRow row) {
        if (row.decision() == null) {
            return null;
        }
        return new ApprovalDecisionResponse(
                row.decision(),
                row.decisionReason(),
                row.decidedByName(),
                row.decisionRequestVersion(),
                row.decidedAt()
        );
    }

    private long calculateTotalAmount(List<ApprovalItemResponse> items) {
        long total = 0;
        for (ApprovalItemResponse item : items) {
            total = Math.addExact(total, item.amount());
        }
        return total;
    }

    private void validatePage(int page, int size) {
        if (page < 0) {
            throw invalidQuery("pageは0以上で指定してください。");
        }
        if (!ALLOWED_PAGE_SIZES.contains(size)) {
            throw invalidQuery("sizeは20、50、100のいずれかを指定してください。");
        }
    }

    private void validateDateRange(LocalDate submittedFrom, LocalDate submittedTo) {
        if (submittedFrom != null && submittedTo != null && submittedFrom.isAfter(submittedTo)) {
            throw invalidQuery("submittedFromはsubmittedTo以前の日付を指定してください。");
        }
    }

    private String normalizeKeyword(String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return null;
        }
        String normalized = keyword.trim();
        if (normalized.length() > MAX_KEYWORD_LENGTH) {
            throw invalidQuery("keywordは100文字以内で指定してください。");
        }
        return normalized
                .replace("\\", "\\\\")
                .replace("%", "\\%")
                .replace("_", "\\_");
    }

    private ApprovalSort parseSort(String sort) {
        if (sort == null || sort.isBlank()) {
            return ApprovalSort.OLDEST;
        }
        try {
            return ApprovalSort.valueOf(sort.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException exception) {
            throw invalidQuery("sortに指定できない値が含まれています。");
        }
    }

    private java.time.Instant toExclusiveInstant(LocalDate submittedTo) {
        if (submittedTo == null) {
            return null;
        }
        try {
            return submittedTo.plusDays(1).atStartOfDay(BUSINESS_ZONE).toInstant();
        } catch (DateTimeException exception) {
            throw invalidQuery("submittedToに指定できない日付が含まれています。");
        }
    }

    private ApiException invalidQuery(String message) {
        return new ApiException(HttpStatus.BAD_REQUEST, "INVALID_QUERY_PARAMETER", message);
    }
}
