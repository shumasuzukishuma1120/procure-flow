package com.example.procureflow.request.application;

import com.example.procureflow.common.error.ApiException;
import com.example.procureflow.common.error.ApiFieldError;
import com.example.procureflow.request.infrastructure.DraftRequestUpdateRow;
import com.example.procureflow.request.infrastructure.IdempotencyRecord;
import com.example.procureflow.request.infrastructure.IdempotencyRecordMapper;
import com.example.procureflow.request.infrastructure.OwnedRequestStateRow;
import com.example.procureflow.request.infrastructure.PurchaseRequestMapper;
import com.example.procureflow.request.infrastructure.PurchaseRequestRow;
import com.example.procureflow.request.infrastructure.ReferenceDataMapper;
import com.example.procureflow.request.infrastructure.RequestDetailRow;
import com.example.procureflow.request.infrastructure.RequestItemMapper;
import com.example.procureflow.request.infrastructure.RequestItemRow;
import com.example.procureflow.request.presentation.dto.CreateDraftRequest;
import com.example.procureflow.request.presentation.dto.CreateDraftRequestItem;
import com.example.procureflow.request.presentation.dto.DraftRequestResponse;
import com.example.procureflow.request.presentation.dto.RequestItemResponse;
import com.example.procureflow.request.presentation.dto.UpdateDraftRequest;
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
import java.util.ArrayList;
import java.util.HexFormat;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DraftRequestService {

    private static final String OPERATION_TYPE = "CREATE_DRAFT";
    private static final Duration IDEMPOTENCY_RETENTION = Duration.ofHours(24);

    private final CurrentUserProvider currentUserProvider;
    private final PurchaseRequestMapper purchaseRequestMapper;
    private final RequestItemMapper requestItemMapper;
    private final ReferenceDataMapper referenceDataMapper;
    private final IdempotencyRecordMapper idempotencyRecordMapper;
    private final ObjectMapper objectMapper;
    private final Clock clock;

    @Transactional
    public DraftRequestResponse create(String idempotencyKey, CreateDraftRequest request) {
        validateIdempotencyKey(idempotencyKey);

        CreateDraftRequest normalizedRequest = normalize(request);
        validateDraftContent(normalizedRequest);
        validateReferenceData(normalizedRequest);

        CurrentUser currentUser = currentUserProvider.getCurrentUser();
        String requestHash = calculateRequestHash(normalizedRequest);
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

        UUID requestId = UUID.randomUUID();
        PurchaseRequestRow requestRow = new PurchaseRequestRow(
                requestId,
                currentUser.id(),
                currentUser.id(),
                currentUser.departmentId(),
                normalizedRequest.requestedSupplierId(),
                normalizedRequest.title(),
                normalizedRequest.reason(),
                normalizedRequest.desiredDeliveryDate(),
                normalizedRequest.note(),
                "DRAFT",
                0,
                now,
                now
        );
        purchaseRequestMapper.insert(requestRow);

        insertItems(requestId, normalizedRequest.items(), now);

        DraftRequestResponse response = new DraftRequestResponse(
                requestId,
                null,
                "DRAFT",
                normalizedRequest.title(),
                normalizedRequest.reason(),
                normalizedRequest.desiredDeliveryDate(),
                normalizedRequest.requestedSupplierId(),
                normalizedRequest.note(),
                toItemResponses(normalizedRequest.items()),
                calculateTotalAmount(normalizedRequest.items()),
                0,
                now,
                now
        );

        int completed = idempotencyRecordMapper.complete(
                currentUser.id(),
                OPERATION_TYPE,
                idempotencyKey,
                requestId,
                HttpStatus.CREATED.value(),
                writeJson(response)
        );
        if (completed != 1) {
            throw new IllegalStateException("Idempotency record could not be completed.");
        }

        return response;
    }

    @Transactional
    public DraftRequestResponse update(UUID requestId, UpdateDraftRequest request) {
        CreateDraftRequest normalizedRequest = normalize(new CreateDraftRequest(
                request.title(),
                request.reason(),
                request.desiredDeliveryDate(),
                request.requestedSupplierId(),
                request.note(),
                request.items()
        ));
        validateDraftContent(normalizedRequest);
        validateReferenceData(normalizedRequest);

        CurrentUser currentUser = currentUserProvider.getCurrentUser();
        RequestDetailRow currentRequest = purchaseRequestMapper.findOwnedRequest(
                requestId,
                currentUser.id()
        );
        if (currentRequest == null) {
            throw requestNotFound();
        }

        Instant now = clock.instant();
        int updated = purchaseRequestMapper.updateOwnedDraft(new DraftRequestUpdateRow(
                requestId,
                currentUser.id(),
                normalizedRequest.requestedSupplierId(),
                normalizedRequest.title(),
                normalizedRequest.reason(),
                normalizedRequest.desiredDeliveryDate(),
                normalizedRequest.note(),
                request.version(),
                now
        ));
        if (updated != 1) {
            throwUpdateFailure(requestId, currentUser.id(), request.version());
        }

        requestItemMapper.deleteByRequestId(requestId);
        insertItems(requestId, normalizedRequest.items(), now);

        return new DraftRequestResponse(
                requestId,
                null,
                "DRAFT",
                normalizedRequest.title(),
                normalizedRequest.reason(),
                normalizedRequest.desiredDeliveryDate(),
                normalizedRequest.requestedSupplierId(),
                normalizedRequest.note(),
                toItemResponses(normalizedRequest.items()),
                calculateTotalAmount(normalizedRequest.items()),
                request.version() + 1,
                currentRequest.createdAt(),
                now
        );
    }

    private void throwUpdateFailure(UUID requestId, UUID applicantId, long expectedVersion) {
        OwnedRequestStateRow current = purchaseRequestMapper.findOwnedState(requestId, applicantId);
        if (current == null) {
            throw requestNotFound();
        }
        if (!"DRAFT".equals(current.status())) {
            throw new ApiException(
                    HttpStatus.CONFLICT,
                    "REQUEST_STATUS_CONFLICT",
                    "下書き状態ではない申請は更新できません。"
            );
        }
        if (current.version() != expectedVersion) {
            throw new ApiException(
                    HttpStatus.CONFLICT,
                    "REQUEST_VERSION_CONFLICT",
                    "申請が他の操作によって更新されています。再読み込みしてからやり直してください。"
            );
        }

        throw new IllegalStateException("Draft request could not be updated.");
    }

    private ApiException requestNotFound() {
        return new ApiException(
                HttpStatus.NOT_FOUND,
                "REQUEST_NOT_FOUND",
                "対象の申請が見つかりません。"
        );
    }

    private void insertItems(UUID requestId, List<CreateDraftRequestItem> items, Instant now) {
        for (int index = 0; index < items.size(); index++) {
            CreateDraftRequestItem item = items.get(index);
            requestItemMapper.insert(new RequestItemRow(
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
        }
    }

    private List<RequestItemResponse> toItemResponses(List<CreateDraftRequestItem> items) {
        return items.stream()
                .map(item -> new RequestItemResponse(
                        item.productName(),
                        item.modelNumber(),
                        item.productUrl(),
                        item.categoryId(),
                        item.quantity(),
                        item.plannedUnitPrice()
                ))
                .toList();
    }

    private DraftRequestResponse resolveRepeatedRequest(
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
                    "同じIdempotency-Keyが異なる内容の下書き作成に使用されました。"
            );
        }
        if (!"COMPLETED".equals(record.processingStatus()) || record.responseBody() == null) {
            throw new ApiException(
                    HttpStatus.CONFLICT,
                    "IDEMPOTENCY_REQUEST_IN_PROGRESS",
                    "同じ操作を処理中です。しばらく待ってから再試行してください。"
            );
        }

        return readJson(record.responseBody(), DraftRequestResponse.class);
    }

    private void validateIdempotencyKey(String idempotencyKey) {
        if (idempotencyKey == null || idempotencyKey.isBlank()) {
            throw new ApiException(
                    HttpStatus.BAD_REQUEST,
                    "IDEMPOTENCY_KEY_REQUIRED",
                    "下書きの作成にはIdempotency-Keyが必要です。"
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

    private void validateDraftContent(CreateDraftRequest request) {
        boolean hasBasicContent = request.title() != null
                || request.reason() != null
                || request.desiredDeliveryDate() != null
                || request.requestedSupplierId() != null
                || request.note() != null;
        boolean hasItemContent = request.items().stream().anyMatch(this::hasContent);

        if (!hasBasicContent && !hasItemContent) {
            throw new ApiException(
                    HttpStatus.UNPROCESSABLE_CONTENT,
                    "DRAFT_CONTENT_REQUIRED",
                    "下書きには少なくとも1つの入力内容が必要です。"
            );
        }
    }

    private boolean hasContent(CreateDraftRequestItem item) {
        return item.productName() != null
                || item.modelNumber() != null
                || item.productUrl() != null
                || item.categoryId() != null
                || item.quantity() != null
                || item.plannedUnitPrice() != null;
    }

    private void validateReferenceData(CreateDraftRequest request) {
        List<ApiFieldError> errors = new ArrayList<>();

        if (request.requestedSupplierId() != null
                && !referenceDataMapper.existsActiveSupplier(request.requestedSupplierId())) {
            errors.add(new ApiFieldError(
                    "requestedSupplierId",
                    "INVALID_SUPPLIER",
                    "有効な希望仕入先を選択してください。"
            ));
        }

        Set<UUID> requestedCategoryIds = new HashSet<>();
        for (CreateDraftRequestItem item : request.items()) {
            if (item.categoryId() != null) {
                requestedCategoryIds.add(item.categoryId());
            }
        }

        Set<UUID> activeCategoryIds = requestedCategoryIds.isEmpty()
                ? Set.of()
                : new HashSet<>(referenceDataMapper.findActiveCategoryIds(requestedCategoryIds));

        for (int index = 0; index < request.items().size(); index++) {
            UUID categoryId = request.items().get(index).categoryId();
            if (categoryId != null && !activeCategoryIds.contains(categoryId)) {
                errors.add(new ApiFieldError(
                        "items[" + index + "].categoryId",
                        "INVALID_CATEGORY",
                        "有効なカテゴリを選択してください。"
                ));
            }
        }

        if (!errors.isEmpty()) {
            throw new ApiException(
                    HttpStatus.UNPROCESSABLE_CONTENT,
                    "INVALID_REFERENCE_DATA",
                    "無効なマスターデータが指定されています。",
                    errors
            );
        }
    }

    private CreateDraftRequest normalize(CreateDraftRequest request) {
        List<CreateDraftRequestItem> items = request.items().stream()
                .map(item -> new CreateDraftRequestItem(
                        normalizeText(item.productName()),
                        normalizeText(item.modelNumber()),
                        normalizeText(item.productUrl()),
                        item.categoryId(),
                        item.quantity(),
                        item.plannedUnitPrice()
                ))
                .toList();

        return new CreateDraftRequest(
                normalizeText(request.title()),
                normalizeText(request.reason()),
                request.desiredDeliveryDate(),
                request.requestedSupplierId(),
                normalizeText(request.note()),
                items
        );
    }

    private String normalizeText(String value) {
        if (value == null) {
            return null;
        }
        String normalized = value.trim();
        return normalized.isEmpty() ? null : normalized;
    }

    private long calculateTotalAmount(List<CreateDraftRequestItem> items) {
        long total = 0;
        for (CreateDraftRequestItem item : items) {
            if (item.quantity() != null && item.plannedUnitPrice() != null) {
                long itemAmount = Math.multiplyExact(item.quantity().longValue(), item.plannedUnitPrice());
                total = Math.addExact(total, itemAmount);
            }
        }
        return total;
    }

    private String calculateRequestHash(CreateDraftRequest request) {
        try {
            byte[] serializedRequest = objectMapper.writeValueAsBytes(request);
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
}
