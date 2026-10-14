package com.example.procureflow.request.application;

import com.example.procureflow.common.error.ApiException;
import com.example.procureflow.request.infrastructure.OwnedRequestStateRow;
import com.example.procureflow.request.infrastructure.PurchaseRequestMapper;
import com.example.procureflow.request.infrastructure.RequestCancellationMapper;
import com.example.procureflow.request.infrastructure.RequestStatusHistoryMapper;
import com.example.procureflow.request.presentation.dto.CancelRequestRequest;
import com.example.procureflow.request.presentation.dto.CancelRequestResponse;
import com.example.procureflow.security.CurrentUser;
import com.example.procureflow.security.CurrentUserProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RequestCommandService {

    private static final String DRAFT = "DRAFT";
    private static final String SUBMITTED = "SUBMITTED";
    private static final String CANCELED = "CANCELED";

    private final CurrentUserProvider currentUserProvider;
    private final PurchaseRequestMapper purchaseRequestMapper;
    private final RequestCancellationMapper requestCancellationMapper;
    private final RequestStatusHistoryMapper requestStatusHistoryMapper;
    private final Clock clock;

    @Transactional
    public void deleteDraft(UUID requestId, long version) {
        CurrentUser currentUser = currentUserProvider.getCurrentUser();

        int deleted = purchaseRequestMapper.deleteOwnedDraft(requestId, currentUser.id(), version);
        if (deleted == 1) {
            return;
        }

        throwCommandFailure(requestId, currentUser.id(), DRAFT, version);
    }

    @Transactional
    public CancelRequestResponse cancel(UUID requestId, CancelRequestRequest request) {
        CurrentUser currentUser = currentUserProvider.getCurrentUser();
        String reason = request.reason().trim();
        Instant canceledAt = clock.instant();

        int updated = purchaseRequestMapper.cancelOwnedSubmitted(
                requestId,
                currentUser.id(),
                request.version(),
                canceledAt
        );
        if (updated != 1) {
            throwCommandFailure(requestId, currentUser.id(), SUBMITTED, request.version());
        }

        long nextVersion = request.version() + 1;

        requestCancellationMapper.insert(
                UUID.randomUUID(),
                requestId,
                currentUser.id(),
                reason,
                canceledAt
        );
        requestStatusHistoryMapper.insert(
                UUID.randomUUID(),
                requestId,
                SUBMITTED,
                CANCELED,
                nextVersion,
                currentUser.id(),
                "USER",
                canceledAt
        );

        return new CancelRequestResponse(requestId, CANCELED, nextVersion, canceledAt);
    }

    private void throwCommandFailure(
            UUID requestId,
            UUID applicantId,
            String expectedStatus,
            long expectedVersion
    ) {
        OwnedRequestStateRow current = purchaseRequestMapper.findOwnedState(requestId, applicantId);
        if (current == null) {
            throw new ApiException(
                    HttpStatus.NOT_FOUND,
                    "REQUEST_NOT_FOUND",
                    "対象の申請が見つかりません。"
            );
        }
        if (!expectedStatus.equals(current.status())) {
            throw new ApiException(
                    HttpStatus.CONFLICT,
                    "REQUEST_STATUS_CONFLICT",
                    "申請の状態が変更されています。最新の一覧を確認してください。"
            );
        }
        if (current.version() != expectedVersion) {
            throw new ApiException(
                    HttpStatus.CONFLICT,
                    "REQUEST_VERSION_CONFLICT",
                    "申請が別の操作で更新されています。最新の一覧を確認してください。"
            );
        }

        throw new IllegalStateException("Request command did not update the expected row.");
    }
}
