package com.example.procureflow.request.application;

import com.example.procureflow.common.error.ApiException;
import com.example.procureflow.common.error.ApiFieldError;
import com.example.procureflow.request.infrastructure.IdempotencyRecord;
import com.example.procureflow.request.infrastructure.IdempotencyRecordMapper;
import com.example.procureflow.request.infrastructure.OwnedRequestStateRow;
import com.example.procureflow.request.infrastructure.PurchaseRequestMapper;
import com.example.procureflow.request.infrastructure.ReferenceDataMapper;
import com.example.procureflow.request.infrastructure.RequestItemMapper;
import com.example.procureflow.request.infrastructure.RequestItemRow;
import com.example.procureflow.request.infrastructure.RequestStatusHistoryMapper;
import com.example.procureflow.request.infrastructure.SubmitDraftUpdateRow;
import com.example.procureflow.request.presentation.dto.RequestSubmissionResponse;
import com.example.procureflow.request.presentation.dto.SubmitDraftRequest;
import com.example.procureflow.request.presentation.dto.SubmitDraftRequestItem;
import com.example.procureflow.security.CurrentUser;
import com.example.procureflow.security.CurrentUserProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.core.JacksonException;
import tools.jackson.databind.ObjectMapper;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.HexFormat;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RequestSubmissionService {

    private static final String DRAFT = "DRAFT";
    private static final String SUBMITTED = "SUBMITTED";
    private static final String OPERATION_TYPE = "SUBMIT_REQUEST";
    private static final Duration IDEMPOTENCY_RETENTION = Duration.ofHours(24);
    private static final ZoneId BUSINESS_ZONE = ZoneId.of("Asia/Tokyo");

    private final CurrentUserProvider currentUserProvider;
    private final PurchaseRequestMapper purchaseRequestMapper;
    private final RequestItemMapper requestItemMapper;
    private final ReferenceDataMapper referenceDataMapper;
    private final RequestStatusHistoryMapper requestStatusHistoryMapper;
    private final IdempotencyRecordMapper idempotencyRecordMapper;
    private final ObjectMapper objectMapper;
    private final Clock clock;

    @Transactional
    public RequestSubmissionResponse submit(
            UUID requestId,
            String idempotencyKey,
            SubmitDraftRequest request
    ) {
        validateIdempotencyKey(idempotencyKey);

        SubmitDraftRequest normalizedRequest = normalize(request);
        CurrentUser currentUser = currentUserProvider.getCurrentUser();
        String requestHash = calculateRequestHash(requestId, normalizedRequest);
        Instant now = clock.instant();

        int inserted = idempotencyRecordMapper.insertProcessingIfAbsent(
                UUID.randomUUID(),
                currentUser.id(),
                OPERATION_TYPE,
                idempotencyKey,
                requestHash,
                now,
                now.plus(IDEMPOTENCY_RETENTION)
        );
        if (inserted == 0) {
            return resolveRepeatedRequest(currentUser.id(), idempotencyKey, requestHash);
        }

        ReferenceData referenceData = validateAndLoadReferenceData(normalizedRequest, currentUser);
        long sequence = purchaseRequestMapper.nextRequestNumberSequence();
        String requestNumber = formatRequestNumber(sequence, now);
        int updated = purchaseRequestMapper.submitOwnedDraft(new SubmitDraftUpdateRow(
                requestId,
                currentUser.id(),
                currentUser.id(),
                currentUser.departmentId(),
                referenceData.departmentName(),
                normalizedRequest.requestedSupplierId(),
                referenceData.supplierName(),
                requestNumber,
                normalizedRequest.title(),
                normalizedRequest.reason(),
                normalizedRequest.desiredDeliveryDate(),
                normalizedRequest.note(),
                normalizedRequest.version(),
                now
        ));
        if (updated != 1) {
            throwSubmissionFailure(requestId, currentUser.id(), normalizedRequest.version());
        }

        requestItemMapper.deleteByRequestId(requestId);
        insertItems(requestId, normalizedRequest.items(), now);

        long nextVersion = normalizedRequest.version() + 1;
        int historyInserted = requestStatusHistoryMapper.insert(
                UUID.randomUUID(),
                requestId,
                DRAFT,
                SUBMITTED,
                nextVersion,
                currentUser.id(),
                "USER",
                now
        );
        if (historyInserted != 1) {
            throw new IllegalStateException("Request status history could not be inserted.");
        }

        RequestSubmissionResponse response = new RequestSubmissionResponse(
                requestId,
                requestNumber,
                SUBMITTED,
                nextVersion,
                now
        );
        int completed = idempotencyRecordMapper.complete(
                currentUser.id(),
                OPERATION_TYPE,
                idempotencyKey,
                requestId,
                HttpStatus.OK.value(),
                writeJson(response)
        );
        if (completed != 1) {
            throw new IllegalStateException("Idempotency record could not be completed.");
        }

        return response;
    }

    private ReferenceData validateAndLoadReferenceData(
            SubmitDraftRequest request,
            CurrentUser currentUser
    ) {
        List<ApiFieldError> errors = new ArrayList<>();
        String supplierName = referenceDataMapper.findActiveSupplierName(
                request.requestedSupplierId()
        );
        if (supplierName == null) {
            errors.add(new ApiFieldError(
                    "requestedSupplierId",
                    "INVALID_SUPPLIER",
                    "有効な希望仕入先を選択してください。"
            ));
        }

        Set<UUID> requestedCategoryIds = new HashSet<>();
        for (SubmitDraftRequestItem item : request.items()) {
            requestedCategoryIds.add(item.categoryId());
        }
        Set<UUID> activeCategoryIds = new HashSet<>(
                referenceDataMapper.findActiveCategoryIds(requestedCategoryIds)
        );
        for (int index = 0; index < request.items().size(); index++) {
            UUID categoryId = request.items().get(index).categoryId();
            if (!activeCategoryIds.contains(categoryId)) {
                errors.add(new ApiFieldError(
                        "items[" + index + "].categoryId",
                        "INVALID_CATEGORY",
                        "有効なカテゴリを選択してください。"
                ));
            }
        }

        String departmentName = referenceDataMapper.findDepartmentName(currentUser.departmentId());
        if (departmentName == null) {
            throw new ApiException(
                    HttpStatus.UNPROCESSABLE_CONTENT,
                    "INVALID_DEPARTMENT",
                    "所属部門を確認できません。管理者へお問い合わせください。"
            );
        }
        if (!errors.isEmpty()) {
            throw new ApiException(
                    HttpStatus.UNPROCESSABLE_CONTENT,
                    "INVALID_REFERENCE_DATA",
                    "無効なマスターデータが指定されています。",
                    errors
            );
        }

        return new ReferenceData(departmentName, supplierName);
    }

    private void insertItems(UUID requestId, List<SubmitDraftRequestItem> items, Instant now) {
        for (int index = 0; index < items.size(); index++) {
            SubmitDraftRequestItem item = items.get(index);
            int inserted = requestItemMapper.insert(new RequestItemRow(
                    UUID.randomUUID(),
                    requestId,
                    index + 1,
                    item.productName(),
                    item.modelNumber(),
                    item.productUrl(),
                    item.categoryId(),
                    item.quantity(),
                    item.plannedUnitPrice(),
                    now,
                    now
            ));
            if (inserted != 1) {
                throw new IllegalStateException("Request item could not be inserted.");
            }
        }
    }

    private void throwSubmissionFailure(UUID requestId, UUID applicantId, long expectedVersion) {
        OwnedRequestStateRow current = purchaseRequestMapper.findOwnedState(requestId, applicantId);
        if (current == null) {
            throw new ApiException(
                    HttpStatus.NOT_FOUND,
                    "REQUEST_NOT_FOUND",
                    "対象の申請が見つかりません。"
            );
        }
        if (!DRAFT.equals(current.status())) {
            throw new ApiException(
                    HttpStatus.CONFLICT,
                    "REQUEST_STATUS_CONFLICT",
                    "下書き状態ではない申請は提出できません。最新の申請情報を確認してください。"
            );
        }
        if (current.version() != expectedVersion) {
            throw new ApiException(
                    HttpStatus.CONFLICT,
                    "REQUEST_VERSION_CONFLICT",
                    "申請が他の操作によって更新されています。再読み込みしてからやり直してください。"
            );
        }

        throw new IllegalStateException("Draft request could not be submitted.");
    }

    private RequestSubmissionResponse resolveRepeatedRequest(
            UUID userId,
            String idempotencyKey,
            String requestHash
    ) {
        IdempotencyRecord record = idempotencyRecordMapper.find(
                userId,
                OPERATION_TYPE,
                idempotencyKey
        );
        if (record == null) {
            throw new IllegalStateException("Idempotency record was not found after a conflict.");
        }
        if (!MessageDigest.isEqual(
                record.requestHash().getBytes(StandardCharsets.UTF_8),
                requestHash.getBytes(StandardCharsets.UTF_8)
        )) {
            throw new ApiException(
                    HttpStatus.CONFLICT,
                    "IDEMPOTENCY_KEY_CONFLICT",
                    "同じIdempotency-Keyが異なる申請提出に使用されました。"
            );
        }
        if (!"COMPLETED".equals(record.processingStatus()) || record.responseBody() == null) {
            throw new ApiException(
                    HttpStatus.CONFLICT,
                    "IDEMPOTENCY_REQUEST_IN_PROGRESS",
                    "同じ申請提出を処理中です。しばらく待ってから再試行してください。"
            );
        }

        return readJson(record.responseBody(), RequestSubmissionResponse.class);
    }

    private void validateIdempotencyKey(String idempotencyKey) {
        if (idempotencyKey == null || idempotencyKey.isBlank()) {
            throw new ApiException(
                    HttpStatus.BAD_REQUEST,
                    "IDEMPOTENCY_KEY_REQUIRED",
                    "申請の提出にはIdempotency-Keyが必要です。"
            );
        }
        if (idempotencyKey.length() > 255) {
            throw new ApiException(
                    HttpStatus.BAD_REQUEST,
                    "IDEMPOTENCY_KEY_INVALID",
                    "Idempotency-Keyは255文字以内で指定してください。"
            );
        }
    }

    private SubmitDraftRequest normalize(SubmitDraftRequest request) {
        List<SubmitDraftRequestItem> items = request.items().stream()
                .map(item -> new SubmitDraftRequestItem(
                        item.productName().trim(),
                        normalizeOptionalText(item.modelNumber()),
                        normalizeOptionalText(item.productUrl()),
                        item.categoryId(),
                        item.quantity(),
                        item.plannedUnitPrice()
                ))
                .toList();

        return new SubmitDraftRequest(
                request.title().trim(),
                request.reason().trim(),
                request.desiredDeliveryDate(),
                request.requestedSupplierId(),
                normalizeOptionalText(request.note()),
                items,
                request.version()
        );
    }

    private String normalizeOptionalText(String value) {
        if (value == null) {
            return null;
        }
        String normalized = value.trim();
        return normalized.isEmpty() ? null : normalized;
    }

    private String formatRequestNumber(long sequence, Instant submittedAt) {
        int year = submittedAt.atZone(BUSINESS_ZONE).getYear();
        return String.format(Locale.ROOT, "REQ-%d-%06d", year, sequence);
    }

    private String calculateRequestHash(UUID requestId, SubmitDraftRequest request) {
        try {
            byte[] serializedRequest = objectMapper.writeValueAsBytes(
                    new SubmissionHashPayload(requestId, request)
            );
            byte[] hash = MessageDigest.getInstance("SHA-256").digest(serializedRequest);
            return HexFormat.of().formatHex(hash);
        } catch (JacksonException | NoSuchAlgorithmException exception) {
            throw new IllegalStateException("Request hash could not be calculated.", exception);
        }
    }

    private String writeJson(Object value) {
        try {
            return objectMapper.writeValueAsString(value);
        } catch (JacksonException exception) {
            throw new IllegalStateException("Response could not be serialized.", exception);
        }
    }

    private <T> T readJson(String value, Class<T> type) {
        try {
            return objectMapper.readValue(value, type);
        } catch (JacksonException exception) {
            throw new IllegalStateException("Stored response could not be deserialized.", exception);
        }
    }

    private record ReferenceData(
            String departmentName,
            String supplierName
    ) {
    }

    private record SubmissionHashPayload(
            UUID requestId,
            SubmitDraftRequest request
    ) {
    }
}
