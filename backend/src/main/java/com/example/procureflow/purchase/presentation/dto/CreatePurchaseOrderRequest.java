package com.example.procureflow.purchase.presentation.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record CreatePurchaseOrderRequest(
        @PositiveOrZero long version,
        @NotNull UUID actualSupplierId,
        @NotBlank @Size(max = 100) String purchaseOrderNumber,
        @NotNull LocalDate promisedDeliveryDate,
        @Size(max = 1000) String purchaserNote,
        @NotEmpty @Valid List<PurchaseOrderItemRequest> items
) {
}
