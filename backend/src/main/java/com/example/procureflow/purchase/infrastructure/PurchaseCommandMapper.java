package com.example.procureflow.purchase.infrastructure;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Mapper
public interface PurchaseCommandMapper {
    PurchaseStateRow findState(@Param("requestId") UUID requestId);
    String findActiveSupplierName(@Param("supplierId") UUID supplierId);
    int updateStatus(@Param("requestId") UUID requestId, @Param("expectedStatus") String expectedStatus,
                     @Param("nextStatus") String nextStatus, @Param("expectedVersion") long expectedVersion,
                     @Param("updatedAt") Instant updatedAt);
    int insertOrder(@Param("id") UUID id, @Param("requestId") UUID requestId,
                    @Param("supplierId") UUID supplierId, @Param("supplierName") String supplierName,
                    @Param("orderNumber") String orderNumber, @Param("promisedDate") LocalDate promisedDate,
                    @Param("note") String note, @Param("orderedBy") UUID orderedBy,
                    @Param("orderedAt") Instant orderedAt);
    int insertOrderItems(@Param("purchaseOrderId") UUID purchaseOrderId,
                         @Param("items") List<PurchaseOrderItemValue> items);
    int insertReceipt(@Param("id") UUID id, @Param("purchaseOrderId") UUID purchaseOrderId,
                      @Param("receivedDate") LocalDate receivedDate, @Param("note") String note,
                      @Param("receivedBy") UUID receivedBy, @Param("completedAt") Instant completedAt);
}
