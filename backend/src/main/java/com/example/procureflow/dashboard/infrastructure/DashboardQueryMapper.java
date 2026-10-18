package com.example.procureflow.dashboard.infrastructure;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Mapper
public interface DashboardQueryMapper {

    List<DashboardStatusCountRow> findMyStatusCounts(
            @Param("applicantId") UUID applicantId
    );

    List<DashboardRequestSummaryRow> findRecentMyRequests(
            @Param("applicantId") UUID applicantId,
            @Param("limit") int limit
    );

    ApprovalDashboardMetricsRow findApprovalMetrics(
            @Param("approverId") UUID approverId,
            @Param("currentDate") LocalDate currentDate
    );

    List<DashboardRequestSummaryRow> findOldestPendingApprovals(
            @Param("approverId") UUID approverId,
            @Param("limit") int limit
    );

    PurchaseDashboardMetricsRow findPurchaseMetrics();

    List<DashboardRequestSummaryRow> findUpcomingPurchaseRequests(
            @Param("limit") int limit
    );
}
