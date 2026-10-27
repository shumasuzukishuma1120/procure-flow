package com.example.procureflow.purchase.infrastructure;

import com.example.procureflow.purchase.presentation.dto.PurchaseDepartmentResponse;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.UUID;

@Mapper
public interface PurchaseQueryMapper {
    List<PurchaseListItemRow> findAll(@Param("criteria") PurchaseSearchCriteria criteria);
    long count(@Param("criteria") PurchaseSearchCriteria criteria);
    PurchaseDetailRow findDetail(@Param("requestId") UUID requestId);
    List<PurchaseItemRow> findItems(@Param("requestId") UUID requestId);
    List<PurchaseDepartmentResponse> findActiveDepartments();
}
