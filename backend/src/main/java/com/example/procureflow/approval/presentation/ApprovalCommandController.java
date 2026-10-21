package com.example.procureflow.approval.presentation;

import com.example.procureflow.approval.application.ApprovalCommandService;
import com.example.procureflow.approval.presentation.dto.ApprovalActionResponse;
import com.example.procureflow.approval.presentation.dto.ApproveRequest;
import com.example.procureflow.approval.presentation.dto.RejectRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/approvals")
@RequiredArgsConstructor
public class ApprovalCommandController {

    private final ApprovalCommandService approvalCommandService;

    @PostMapping("/{requestId}/approve")
    public ApprovalActionResponse approve(
            @PathVariable UUID requestId,
            @RequestHeader(name = "Idempotency-Key", required = false) String idempotencyKey,
            @Valid @RequestBody ApproveRequest request
    ) {
        return approvalCommandService.approve(requestId, idempotencyKey, request);
    }

    @PostMapping("/{requestId}/reject")
    public ApprovalActionResponse reject(
            @PathVariable UUID requestId,
            @RequestHeader(name = "Idempotency-Key", required = false) String idempotencyKey,
            @Valid @RequestBody RejectRequest request
    ) {
        return approvalCommandService.reject(requestId, idempotencyKey, request);
    }
}
