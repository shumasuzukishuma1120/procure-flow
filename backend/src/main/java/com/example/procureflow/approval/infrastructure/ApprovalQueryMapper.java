package com.example.procureflow.approval.infrastructure;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.UUID;

@Mapper
public interface ApprovalQueryMapper {

    List<ApprovalListItemRow> findAll(@Param("criteria") ApprovalSearchCriteria criteria);

    long count(@Param("criteria") ApprovalSearchCriteria criteria);

    List<ApproverDepartmentRow> findApproverDepartments(
            @Param("approverId") UUID approverId
    );

    ApprovalDetailRow findDetail(
            @Param("requestId") UUID requestId,
            @Param("approverId") UUID approverId
    );

    List<ApprovalItemRow> findItems(
            @Param("requestId") UUID requestId,
            @Param("approverId") UUID approverId
    );
}
