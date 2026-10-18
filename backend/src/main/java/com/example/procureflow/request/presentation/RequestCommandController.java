package com.example.procureflow.request.presentation;

import com.example.procureflow.request.application.RequestCommandService;
import com.example.procureflow.request.application.RequestSubmissionService;
import com.example.procureflow.request.presentation.dto.CancelRequestRequest;
import com.example.procureflow.request.presentation.dto.CancelRequestResponse;
import com.example.procureflow.request.presentation.dto.RequestSubmissionResponse;
import com.example.procureflow.request.presentation.dto.SubmitDraftRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/requests")
@RequiredArgsConstructor
@Validated
public class RequestCommandController {

    private final RequestCommandService requestCommandService;
    private final RequestSubmissionService requestSubmissionService;

    @DeleteMapping("/{requestId}")
    public ResponseEntity<Void> deleteDraft(
            @PathVariable UUID requestId,
            @RequestParam @PositiveOrZero long version
    ) {
        requestCommandService.deleteDraft(requestId, version);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{requestId}/cancel")
    public CancelRequestResponse cancel(
            @PathVariable UUID requestId,
            @Valid @RequestBody CancelRequestRequest request
    ) {
        return requestCommandService.cancel(requestId, request);
    }

    @PostMapping("/{requestId}/submit")
    public RequestSubmissionResponse submitDraft(
            @PathVariable UUID requestId,
            @RequestHeader(name = "Idempotency-Key", required = false) String idempotencyKey,
            @Valid @RequestBody SubmitDraftRequest request
    ) {
        return requestSubmissionService.submit(requestId, idempotencyKey, request);
    }
}
