package com.example.procureflow.dashboard.application;

import com.example.procureflow.dashboard.infrastructure.ApprovalDashboardMetricsRow;
import com.example.procureflow.dashboard.infrastructure.DashboardQueryMapper;
import com.example.procureflow.dashboard.infrastructure.DashboardRequestSummaryRow;
import com.example.procureflow.dashboard.infrastructure.PurchaseDashboardMetricsRow;
import com.example.procureflow.dashboard.presentation.dto.ApprovalDashboardResponse;
import com.example.procureflow.dashboard.presentation.dto.DashboardRequestSummaryResponse;
import com.example.procureflow.dashboard.presentation.dto.DashboardResponse;
import com.example.procureflow.dashboard.presentation.dto.DashboardStatusCountResponse;
import com.example.procureflow.dashboard.presentation.dto.MyRequestsDashboardResponse;
import com.example.procureflow.dashboard.presentation.dto.PurchaseDashboardResponse;
import com.example.procureflow.security.CurrentUser;
import com.example.procureflow.security.CurrentUserProvider;
import com.example.procureflow.security.UserRole;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.LocalDate;
import java.time.ZoneId;

@Service
@RequiredArgsConstructor
public class DashboardQueryService {

    private static final int SUMMARY_LIMIT = 5;
    private static final ZoneId BUSINESS_ZONE = ZoneId.of("Asia/Tokyo");

    private final CurrentUserProvider currentUserProvider;
    private final DashboardQueryMapper dashboardQueryMapper;
    private final Clock clock;

    @Transactional(readOnly = true)
    public DashboardResponse getDashboard() {
        CurrentUser currentUser = currentUserProvider.getCurrentUser();
        LocalDate currentDate = LocalDate.now(clock.withZone(BUSINESS_ZONE));

        MyRequestsDashboardResponse myRequests = new MyRequestsDashboardResponse(
                dashboardQueryMapper.findMyStatusCounts(currentUser.id()).stream()
                        .map(row -> new DashboardStatusCountResponse(row.status(), row.count()))
                        .toList(),
                dashboardQueryMapper.findRecentMyRequests(currentUser.id(), SUMMARY_LIMIT).stream()
                        .map(this::toSummaryResponse)
                        .toList()
        );

        ApprovalDashboardResponse approvals = createApprovalDashboard(
                currentUser,
                currentDate
        );

        PurchaseDashboardResponse purchases = createPurchaseDashboard(currentUser);

        return new DashboardResponse(myRequests, approvals, purchases);
    }

    private ApprovalDashboardResponse createApprovalDashboard(
            CurrentUser currentUser,
            LocalDate currentDate
    ) {
        if (!currentUser.hasRole(UserRole.APPROVER)) {
            return new ApprovalDashboardResponse(0, 0, java.util.List.of());
        }

        ApprovalDashboardMetricsRow approvalMetrics =
                dashboardQueryMapper.findApprovalMetrics(currentUser.id(), currentDate);
        return new ApprovalDashboardResponse(
                approvalMetrics.pendingCount(),
                approvalMetrics.overdueCount(),
                dashboardQueryMapper.findOldestPendingApprovals(
                                currentUser.id(),
                                SUMMARY_LIMIT
                        ).stream()
                        .map(this::toSummaryResponse)
                        .toList()
        );
    }

    private PurchaseDashboardResponse createPurchaseDashboard(CurrentUser currentUser) {
        if (!currentUser.hasRole(UserRole.PURCHASER)) {
            return new PurchaseDashboardResponse(0, 0, java.util.List.of());
        }

        PurchaseDashboardMetricsRow purchaseMetrics =
                dashboardQueryMapper.findPurchaseMetrics();
        return new PurchaseDashboardResponse(
                purchaseMetrics.awaitingOrderCount(),
                purchaseMetrics.awaitingReceiptCount(),
                dashboardQueryMapper.findUpcomingPurchaseRequests(SUMMARY_LIMIT).stream()
                        .map(this::toSummaryResponse)
                        .toList()
        );
    }

    private DashboardRequestSummaryResponse toSummaryResponse(
            DashboardRequestSummaryRow row
    ) {
        return new DashboardRequestSummaryResponse(
                row.requestId(),
                row.requestNumber(),
                row.title(),
                row.status(),
                row.applicantName(),
                row.departmentName(),
                row.desiredDeliveryDate(),
                row.totalAmount(),
                row.updatedAt()
        );
    }
}
