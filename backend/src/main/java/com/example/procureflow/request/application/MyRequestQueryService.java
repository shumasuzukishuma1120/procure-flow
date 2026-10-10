package com.example.procureflow.request.application;

import com.example.procureflow.common.error.ApiException;
import com.example.procureflow.request.domain.RequestStatus;
import com.example.procureflow.request.infrastructure.MyRequestListItemRow;
import com.example.procureflow.request.infrastructure.MyRequestQueryMapper;
import com.example.procureflow.request.infrastructure.MyRequestSearchCriteria;
import com.example.procureflow.request.presentation.dto.MyRequestListItemResponse;
import com.example.procureflow.request.presentation.dto.MyRequestListResponse;
import com.example.procureflow.security.CurrentUser;
import com.example.procureflow.security.CurrentUserProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DateTimeException;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MyRequestQueryService {

    private static final Set<Integer> ALLOWED_PAGE_SIZES = Set.of(20, 50, 100);
    private static final int MAX_KEYWORD_LENGTH = 100;
    private static final ZoneId BUSINESS_ZONE = ZoneId.of("Asia/Tokyo");

    private final CurrentUserProvider currentUserProvider;
    private final MyRequestQueryMapper myRequestQueryMapper;

    @Transactional(readOnly = true)
    public MyRequestListResponse findAll(
            int page,
            int size,
            String status,
            String keyword,
            LocalDate createdFrom,
            LocalDate createdTo,
            UUID categoryId,
            UUID supplierId,
            String sort
    ) {
        validatePage(page, size);
        validateDateRange(createdFrom, createdTo);

        RequestStatus parsedStatus = parseStatus(status);
        MyRequestSort parsedSort = parseSort(sort);
        String normalizedKeyword = normalizeKeyword(keyword);
        CurrentUser currentUser = currentUserProvider.getCurrentUser();

        MyRequestSearchCriteria criteria = new MyRequestSearchCriteria(
                currentUser.id(),
                parsedStatus,
                normalizedKeyword,
                createdFrom == null ? null : createdFrom.atStartOfDay(BUSINESS_ZONE).toInstant(),
                toExclusiveInstant(createdTo),
                categoryId,
                supplierId,
                parsedSort,
                size,
                Math.multiplyExact((long) page, size)
        );

        long totalElements = myRequestQueryMapper.count(criteria);
        int totalPages = totalElements == 0
                ? 0
                : Math.toIntExact((totalElements + size - 1) / size);

        return new MyRequestListResponse(
                myRequestQueryMapper.findAll(criteria).stream()
                        .map(this::toResponse)
                        .toList(),
                page,
                size,
                totalElements,
                totalPages
        );
    }

    private void validatePage(int page, int size) {
        if (page < 0) {
            throw invalidQuery("pageは0以上で指定してください。");
        }
        if (!ALLOWED_PAGE_SIZES.contains(size)) {
            throw invalidQuery("sizeは20、50、100のいずれかを指定してください。");
        }
    }

    private void validateDateRange(LocalDate createdFrom, LocalDate createdTo) {
        if (createdFrom != null && createdTo != null && createdFrom.isAfter(createdTo)) {
            throw invalidQuery("createdFromはcreatedTo以前の日付を指定してください。");
        }
    }

    private RequestStatus parseStatus(String status) {
        if (status == null || status.isBlank()) {
            return null;
        }
        try {
            return RequestStatus.valueOf(status.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException exception) {
            throw invalidQuery("statusに指定できない値が含まれています。");
        }
    }

    private MyRequestSort parseSort(String sort) {
        if (sort == null || sort.isBlank()) {
            return MyRequestSort.UPDATED_DESC;
        }
        try {
            return MyRequestSort.valueOf(sort.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException exception) {
            throw invalidQuery("sortに指定できない値が含まれています。");
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

    private java.time.Instant toExclusiveInstant(LocalDate createdTo) {
        if (createdTo == null) {
            return null;
        }
        try {
            return createdTo.plusDays(1).atStartOfDay(BUSINESS_ZONE).toInstant();
        } catch (DateTimeException exception) {
            throw invalidQuery("createdToに指定できない日付が含まれています。");
        }
    }

    private MyRequestListItemResponse toResponse(MyRequestListItemRow row) {
        return new MyRequestListItemResponse(
                row.requestId(),
                row.requestNumber(),
                row.title(),
                row.status(),
                row.firstItemName(),
                row.additionalItemCount(),
                row.requestedSupplierName(),
                row.totalAmount(),
                row.updatedAt(),
                row.version()
        );
    }

    private ApiException invalidQuery(String message) {
        return new ApiException(HttpStatus.BAD_REQUEST, "INVALID_QUERY_PARAMETER", message);
    }
}
