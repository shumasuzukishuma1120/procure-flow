package com.example.procureflow.approval.application;

import com.example.procureflow.approval.infrastructure.ApprovalCommandMapper;
import com.example.procureflow.approval.infrastructure.ApprovalRequestStateRow;
import com.example.procureflow.approval.presentation.dto.ApprovalActionResponse;
import com.example.procureflow.approval.presentation.dto.ApproveRequest;
import com.example.procureflow.approval.presentation.dto.RejectRequest;
import com.example.procureflow.common.error.ApiException;
import com.example.procureflow.request.domain.RequestStatus;
import com.example.procureflow.request.infrastructure.IdempotencyRecord;
import com.example.procureflow.request.infrastructure.IdempotencyRecordMapper;
import com.example.procureflow.request.infrastructure.RequestStatusHistoryMapper;
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
import java.util.HexFormat;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ApprovalCommandService {

    private static final String SUBMITTED = "SUBMITTED";
    private static final String OPERATION_TYPE = "DECIDE_APPROVAL";
    private static final Duration IDEMPOTENCY_RETENTION = Duration.ofHours(24);

    private final CurrentUserProvider currentUserProvider;
    private final ApprovalCommandMapper approvalCommandMapper;
    private final RequestStatusHistoryMapper requestStatusHistoryMapper;
    private final IdempotencyRecordMapper idempotencyRecordMapper;
    private final ObjectMapper objectMapper;
    private final Clock clock;

    @Transactional
    public ApprovalActionResponse approve(
            UUID requestId,
            String idempotencyKey,
            ApproveRequest request
    ) {
        return decide(
                requestId,
                idempotencyKey,
                request.version(),
                RequestStatus.APPROVED,
                null
        );
    }

    @Transactional
    public ApprovalActionResponse reject(
            UUID requestId,
            String idempotencyKey,
            RejectRequest request
    ) {
        return decide(
                requestId,
                idempotencyKey,
                request.version(),
                RequestStatus.REJECTED,
                request.reason().trim()
        );
    }

    private ApprovalActionResponse decide(
            UUID requestId,
            String idempotencyKey,
            long expectedVersion,
            RequestStatus decision,
            String reason
    ) {
        validateIdempotencyKey(idempotencyKey);

        CurrentUser currentUser = currentUserProvider.getCurrentUser();
        String requestHash = calculateRequestHash(requestId, expectedVersion, decision, reason);
        Instant now = clock.instant();

        int idempotencyInserted = idempotencyRecordMapper.insertProcessingIfAbsent(
                UUID.randomUUID(),
                currentUser.id(),
                OPERATION_TYPE,
                idempotencyKey,
                requestHash,
                now,
                now.plus(IDEMPOTENCY_RETENTION)
        );
        if (idempotencyInserted == 0) {
            return resolveRepeatedRequest(currentUser.id(), idempotencyKey, requestHash);
        }

        int updated = approvalCommandMapper.updateDecision(
                requestId,
                currentUser.id(),
                expectedVersion,
                decision.name(),
                now
        );
        if (updated != 1) {
            throwDecisionFailure(requestId, currentUser.id(), expectedVersion);
        }

        long nextVersion = expectedVersion + 1;
        int decisionInserted = approvalCommandMapper.insertDecision(
                UUID.randomUUID(),
                requestId,
                currentUser.id(),
                decision.name(),
                reason,
                nextVersion,
                now
        );
        if (decisionInserted != 1) {
            throw new IllegalStateException("Approval decision could not be inserted.");
        }

        int historyInserted = requestStatusHistoryMapper.insert(
                UUID.randomUUID(),
                requestId,
                SUBMITTED,
                decision.name(),
                nextVersion,
                currentUser.id(),
                "APPROVER",
                now
        );
        if (historyInserted != 1) {
            throw new IllegalStateException("Request status history could not be inserted.");
        }

        ApprovalActionResponse response = new ApprovalActionResponse(
                requestId,
                decision,
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

    private void throwDecisionFailure(
            UUID requestId,
            UUID approverId,
            long expectedVersion
    ) {
        ApprovalRequestStateRow current = approvalCommandMapper.findScopedState(
                requestId,
                approverId
        );
        if (current == null) {
            throw new ApiException(
                    HttpStatus.NOT_FOUND,
                    "APPROVAL_REQUEST_NOT_FOUND",
                    "対象の承認申請が見つかりません。"
            );
        }
        if (current.status() != RequestStatus.SUBMITTED) {
            throw new ApiException(
                    HttpStatus.CONFLICT,
                    "APPROVAL_STATUS_CONFLICT",
                    "この申請はすでに処理されています。最新の申請情報を確認してください。"
            );
        }
        if (current.version() != expectedVersion) {
            throw new ApiException(
                    HttpStatus.CONFLICT,
                    "REQUEST_VERSION_CONFLICT",
                    "申請が他の操作によって更新されています。再読み込みしてからやり直してください。"
            );
        }

        throw new IllegalStateException("Approval decision did not update the expected row.");
    }

    private ApprovalActionResponse resolveRepeatedRequest(
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
                    "同じIdempotency-Keyが異なる承認操作に使用されました。"
            );
        }
        if (!"COMPLETED".equals(record.processingStatus()) || record.responseBody() == null) {
            throw new ApiException(
                    HttpStatus.CONFLICT,
                    "IDEMPOTENCY_REQUEST_IN_PROGRESS",
                    "同じ承認操作を処理中です。しばらく待ってから再試行してください。"
            );
        }

        return readJson(record.responseBody(), ApprovalActionResponse.class);
    }

    private void validateIdempotencyKey(String idempotencyKey) {
        if (idempotencyKey == null || idempotencyKey.isBlank()) {
            throw new ApiException(
                    HttpStatus.BAD_REQUEST,
                    "IDEMPOTENCY_KEY_REQUIRED",
                    "承認操作にはIdempotency-Keyが必要です。"
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

    private String calculateRequestHash(
            UUID requestId,
            long expectedVersion,
            RequestStatus decision,
            String reason
    ) {
        try {
            byte[] serializedRequest = objectMapper.writeValueAsBytes(
                    new ApprovalHashPayload(requestId, expectedVersion, decision, reason)
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

    private record ApprovalHashPayload(
            UUID requestId,
            long expectedVersion,
            RequestStatus decision,
            String reason
    ) {
    }
}
