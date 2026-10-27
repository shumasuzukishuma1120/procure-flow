package com.example.procureflow.purchase.application;

import com.example.procureflow.common.error.ApiException;
import com.example.procureflow.purchase.infrastructure.PurchaseCommandMapper;
import com.example.procureflow.purchase.infrastructure.PurchaseItemRow;
import com.example.procureflow.purchase.infrastructure.PurchaseOrderItemValue;
import com.example.procureflow.purchase.infrastructure.PurchaseQueryMapper;
import com.example.procureflow.purchase.infrastructure.PurchaseStateRow;
import com.example.procureflow.purchase.presentation.dto.CompleteReceiptRequest;
import com.example.procureflow.purchase.presentation.dto.CreatePurchaseOrderRequest;
import com.example.procureflow.purchase.presentation.dto.PurchaseActionResponse;
import com.example.procureflow.purchase.presentation.dto.PurchaseOrderItemRequest;
import com.example.procureflow.request.domain.RequestStatus;
import com.example.procureflow.request.infrastructure.RequestStatusHistoryMapper;
import com.example.procureflow.request.infrastructure.IdempotencyRecord;
import com.example.procureflow.request.infrastructure.IdempotencyRecordMapper;
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
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.HexFormat;

@Service
@RequiredArgsConstructor
public class PurchaseCommandService {
    private static final ZoneId BUSINESS_ZONE = ZoneId.of("Asia/Tokyo");
    private static final Duration IDEMPOTENCY_RETENTION = Duration.ofHours(24);
    private static final String ORDER_OPERATION = "CREATE_PURCHASE_ORDER";
    private static final String RECEIPT_OPERATION = "COMPLETE_RECEIPT";
    private final CurrentUserProvider currentUserProvider;
    private final PurchaseCommandMapper commandMapper;
    private final PurchaseQueryMapper queryMapper;
    private final RequestStatusHistoryMapper historyMapper;
    private final IdempotencyRecordMapper idempotencyRecordMapper;
    private final ObjectMapper objectMapper;
    private final Clock clock;

    @Transactional
    public PurchaseActionResponse order(UUID requestId, String idempotencyKey, CreatePurchaseOrderRequest request) {
        validateIdempotencyKey(idempotencyKey);
        CurrentUser user = currentUserProvider.getCurrentUser();
        String requestHash = calculateRequestHash(new OrderHashPayload(requestId, request));
        var now = clock.instant();
        PurchaseActionResponse repeated = beginOrResolve(user.id(), ORDER_OPERATION, idempotencyKey, requestHash, now);
        if (repeated != null) return repeated;

        PurchaseStateRow state = requireState(requestId, RequestStatus.APPROVED, request.version());
        String supplierName = commandMapper.findActiveSupplierName(request.actualSupplierId());
        if (supplierName == null) {
            throw new ApiException(HttpStatus.UNPROCESSABLE_CONTENT, "SUPPLIER_NOT_AVAILABLE",
                    "選択した仕入先は現在使用できません。");
        }
        List<PurchaseItemRow> sourceItems = queryMapper.findItems(requestId);
        Map<UUID, PurchaseOrderItemRequest> prices = new HashMap<>();
        for (PurchaseOrderItemRequest item : request.items()) {
            if (prices.put(item.requestItemId(), item) != null) {
                throw invalidOrder("同じ明細が重複しています。");
            }
        }
        Set<UUID> expectedIds = new HashSet<>();
        long approvedTotal = 0;
        long actualTotal = 0;
        for (PurchaseItemRow item : sourceItems) {
            expectedIds.add(item.requestItemId());
            PurchaseOrderItemRequest price = prices.get(item.requestItemId());
            if (price == null) throw invalidOrder("すべての申請明細に実単価を指定してください。");
            approvedTotal = Math.addExact(approvedTotal,
                    Math.multiplyExact(item.quantity(), item.plannedUnitPrice()));
            actualTotal = Math.addExact(actualTotal,
                    Math.multiplyExact(item.quantity(), price.actualUnitPrice()));
        }
        if (!prices.keySet().equals(expectedIds)) throw invalidOrder("申請に存在しない明細が含まれています。");
        long excess = actualTotal - approvedTotal;
        if (excess > 10_000 || (excess > 0 && actualTotal * 100 > approvedTotal * 105)) {
            throw new ApiException(HttpStatus.UNPROCESSABLE_CONTENT, "PURCHASE_AMOUNT_EXCEEDED",
                    "実発注額が許容範囲を超えています。再申請が必要です。");
        }

        int updated = commandMapper.updateStatus(requestId, "APPROVED", "ORDERED", request.version(), now);
        if (updated != 1) throwConflict(requestId, RequestStatus.APPROVED, request.version());
        UUID orderId = UUID.randomUUID();
        commandMapper.insertOrder(orderId, requestId, request.actualSupplierId(), supplierName,
                request.purchaseOrderNumber().trim(), request.promisedDeliveryDate(),
                normalize(request.purchaserNote()), user.id(), now);
        List<PurchaseOrderItemValue> values = request.items().stream()
                .map(item -> new PurchaseOrderItemValue(UUID.randomUUID(), item.requestItemId(), item.actualUnitPrice()))
                .toList();
        commandMapper.insertOrderItems(orderId, values);
        long nextVersion = request.version() + 1;
        historyMapper.insert(UUID.randomUUID(), requestId, "APPROVED", "ORDERED",
                nextVersion, user.id(), "PURCHASER", now);
        PurchaseActionResponse response = new PurchaseActionResponse(requestId, RequestStatus.ORDERED, nextVersion, now);
        completeIdempotency(user.id(), ORDER_OPERATION, idempotencyKey, requestId, response);
        return response;
    }

    @Transactional
    public PurchaseActionResponse receive(UUID requestId, String idempotencyKey, CompleteReceiptRequest request) {
        validateIdempotencyKey(idempotencyKey);
        CurrentUser user = currentUserProvider.getCurrentUser();
        String requestHash = calculateRequestHash(new ReceiptHashPayload(requestId, request));
        var now = clock.instant();
        PurchaseActionResponse repeated = beginOrResolve(user.id(), RECEIPT_OPERATION, idempotencyKey, requestHash, now);
        if (repeated != null) return repeated;

        PurchaseStateRow state = requireState(requestId, RequestStatus.ORDERED, request.version());
        LocalDate today = LocalDate.now(clock.withZone(BUSINESS_ZONE));
        LocalDate orderedDate = state.orderedAt().atZone(BUSINESS_ZONE).toLocalDate();
        if (request.receivedDate().isAfter(today) || request.receivedDate().isBefore(orderedDate)) {
            throw new ApiException(HttpStatus.UNPROCESSABLE_CONTENT, "RECEIVED_DATE_INVALID",
                    "受領日は発注日以降かつ本日以前の日付を指定してください。");
        }
        int updated = commandMapper.updateStatus(requestId, "ORDERED", "COMPLETED", request.version(), now);
        if (updated != 1) throwConflict(requestId, RequestStatus.ORDERED, request.version());
        commandMapper.insertReceipt(UUID.randomUUID(), state.purchaseOrderId(), request.receivedDate(),
                normalize(request.receiptNote()), user.id(), now);
        long nextVersion = request.version() + 1;
        historyMapper.insert(UUID.randomUUID(), requestId, "ORDERED", "COMPLETED",
                nextVersion, user.id(), "PURCHASER", now);
        PurchaseActionResponse response = new PurchaseActionResponse(requestId, RequestStatus.COMPLETED, nextVersion, now);
        completeIdempotency(user.id(), RECEIPT_OPERATION, idempotencyKey, requestId, response);
        return response;
    }

    private PurchaseStateRow requireState(UUID id, RequestStatus expected, long version) {
        PurchaseStateRow state = commandMapper.findState(id);
        if (state == null) throw new ApiException(HttpStatus.NOT_FOUND, "PURCHASE_REQUEST_NOT_FOUND",
                "対象の購買申請が見つかりません。");
        if (state.status() != expected) throw new ApiException(HttpStatus.CONFLICT,
                "PURCHASE_STATUS_CONFLICT", "この申請はすでに別の状態へ更新されています。");
        if (state.version() != version) throw new ApiException(HttpStatus.CONFLICT,
                "REQUEST_VERSION_CONFLICT", "申請が更新されています。再読み込みしてください。");
        return state;
    }

    private void throwConflict(UUID id, RequestStatus expected, long version) {
        requireState(id, expected, version);
        throw new IllegalStateException("Purchase request did not update the expected row.");
    }

    private ApiException invalidOrder(String message) {
        return new ApiException(HttpStatus.BAD_REQUEST, "PURCHASE_ITEMS_INVALID", message);
    }

    private String normalize(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }

    private PurchaseActionResponse beginOrResolve(UUID userId, String operationType,
                                                   String idempotencyKey, String requestHash,
                                                   java.time.Instant now) {
        int inserted = idempotencyRecordMapper.insertProcessingIfAbsent(
                UUID.randomUUID(), userId, operationType, idempotencyKey, requestHash,
                now, now.plus(IDEMPOTENCY_RETENTION));
        if (inserted == 1) return null;

        IdempotencyRecord record = idempotencyRecordMapper.find(userId, operationType, idempotencyKey);
        if (record == null) throw new IllegalStateException("Idempotency record was not found after a conflict.");
        if (!MessageDigest.isEqual(record.requestHash().getBytes(StandardCharsets.UTF_8),
                requestHash.getBytes(StandardCharsets.UTF_8))) {
            throw new ApiException(HttpStatus.CONFLICT, "IDEMPOTENCY_KEY_CONFLICT",
                    "同じIdempotency-Keyが異なる購買操作に使用されました。");
        }
        if (!"COMPLETED".equals(record.processingStatus()) || record.responseBody() == null) {
            throw new ApiException(HttpStatus.CONFLICT, "IDEMPOTENCY_REQUEST_IN_PROGRESS",
                    "同じ購買操作を処理中です。しばらく待ってから再試行してください。");
        }
        return readJson(record.responseBody());
    }

    private void completeIdempotency(UUID userId, String operationType, String idempotencyKey,
                                     UUID requestId, PurchaseActionResponse response) {
        int completed = idempotencyRecordMapper.complete(userId, operationType, idempotencyKey,
                requestId, HttpStatus.OK.value(), writeJson(response));
        if (completed != 1) throw new IllegalStateException("Idempotency record could not be completed.");
    }

    private void validateIdempotencyKey(String idempotencyKey) {
        if (idempotencyKey == null || idempotencyKey.isBlank()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "IDEMPOTENCY_KEY_REQUIRED",
                    "購買操作にはIdempotency-Keyが必要です。");
        }
        if (idempotencyKey.length() > 255) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "IDEMPOTENCY_KEY_INVALID",
                    "Idempotency-Keyは255文字以内で指定してください。");
        }
    }

    private String calculateRequestHash(Object payload) {
        try {
            byte[] serialized = objectMapper.writeValueAsBytes(payload);
            return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(serialized));
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

    private PurchaseActionResponse readJson(String value) {
        try {
            return objectMapper.readValue(value, PurchaseActionResponse.class);
        } catch (JacksonException exception) {
            throw new IllegalStateException("Stored response could not be deserialized.", exception);
        }
    }

    private record OrderHashPayload(UUID requestId, CreatePurchaseOrderRequest request) {}
    private record ReceiptHashPayload(UUID requestId, CompleteReceiptRequest request) {}
}
