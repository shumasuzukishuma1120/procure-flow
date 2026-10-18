package com.example.procureflow.dashboard.presentation;

import com.example.procureflow.dashboard.application.DashboardQueryService;
import com.example.procureflow.dashboard.presentation.dto.DashboardResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardQueryService dashboardQueryService;

    @GetMapping
    public DashboardResponse getDashboard() {
        return dashboardQueryService.getDashboard();
    }
}
