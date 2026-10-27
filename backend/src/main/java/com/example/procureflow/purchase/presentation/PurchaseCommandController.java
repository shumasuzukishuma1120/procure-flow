package com.example.procureflow.purchase.presentation;

import com.example.procureflow.purchase.application.PurchaseCommandService;
import com.example.procureflow.purchase.presentation.dto.CompleteReceiptRequest;
import com.example.procureflow.purchase.presentation.dto.CreatePurchaseOrderRequest;
import com.example.procureflow.purchase.presentation.dto.PurchaseActionResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/purchases")
@RequiredArgsConstructor
public class PurchaseCommandController {
    private final PurchaseCommandService service;

    @PostMapping("/{requestId}/order")
    public PurchaseActionResponse order(@PathVariable UUID requestId,
                                        @RequestHeader(name = "Idempotency-Key", required = false) String idempotencyKey,
                                        @Valid @RequestBody CreatePurchaseOrderRequest request) {
        return service.order(requestId, idempotencyKey, request);
    }

    @PostMapping("/{requestId}/receipt")
    public PurchaseActionResponse receive(@PathVariable UUID requestId,
                                          @RequestHeader(name = "Idempotency-Key", required = false) String idempotencyKey,
                                          @Valid @RequestBody CompleteReceiptRequest request) {
        return service.receive(requestId, idempotencyKey, request);
    }
}
