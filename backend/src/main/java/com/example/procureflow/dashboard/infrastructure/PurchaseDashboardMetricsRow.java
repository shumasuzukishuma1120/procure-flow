package com.example.procureflow.dashboard.infrastructure;

public record PurchaseDashboardMetricsRow(
        long awaitingOrderCount,
        long awaitingReceiptCount
) {
}
