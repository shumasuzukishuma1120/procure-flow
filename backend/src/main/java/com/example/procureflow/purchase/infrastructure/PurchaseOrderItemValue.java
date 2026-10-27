package com.example.procureflow.purchase.infrastructure;

import java.util.UUID;

public record PurchaseOrderItemValue(UUID id, UUID requestItemId, long actualUnitPrice) {
}
