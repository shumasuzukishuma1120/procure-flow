package com.example.procureflow.request.presentation;

import com.example.procureflow.request.application.DraftRequestService;
import com.example.procureflow.request.presentation.dto.CreateDraftRequest;
import com.example.procureflow.request.presentation.dto.DraftRequestResponse;
import com.example.procureflow.request.presentation.dto.UpdateDraftRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PutMapping;

import java.util.UUID;

@RestController
@RequestMapping("/api/requests")
@RequiredArgsConstructor
public class DraftRequestController {

    private final DraftRequestService draftRequestService;

    @PostMapping
    public ResponseEntity<DraftRequestResponse> createDraft(
            @RequestHeader(name = "Idempotency-Key", required = false) String idempotencyKey,
            @Valid @RequestBody CreateDraftRequest request
    ) {
        DraftRequestResponse response = draftRequestService.create(idempotencyKey, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{requestId}")
    public DraftRequestResponse updateDraft(
            @PathVariable UUID requestId,
            @Valid @RequestBody UpdateDraftRequest request
    ) {
        return draftRequestService.update(requestId, request);
    }
}
