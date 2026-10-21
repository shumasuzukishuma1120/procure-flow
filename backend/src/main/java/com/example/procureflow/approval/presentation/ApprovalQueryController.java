package com.example.procureflow.approval.presentation;

import com.example.procureflow.approval.application.ApprovalQueryService;
import com.example.procureflow.approval.presentation.dto.ApprovalDetailResponse;
import com.example.procureflow.approval.presentation.dto.ApprovalListResponse;
import com.example.procureflow.approval.presentation.dto.ApproverDepartmentResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/approvals")
@RequiredArgsConstructor
public class ApprovalQueryController {

    private final ApprovalQueryService approvalQueryService;

    @GetMapping
    public ApprovalListResponse findAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate submittedFrom,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate submittedTo,
            @RequestParam(required = false) UUID departmentId,
            @RequestParam(defaultValue = "false") boolean overdueOnly,
            @RequestParam(defaultValue = "OLDEST") String sort
    ) {
        return approvalQueryService.findAll(
                page,
                size,
                keyword,
                submittedFrom,
                submittedTo,
                departmentId,
                overdueOnly,
                sort
        );
    }

    @GetMapping("/{requestId}")
    public ApprovalDetailResponse findById(@PathVariable UUID requestId) {
        return approvalQueryService.findById(requestId);
    }

    @GetMapping("/departments")
    public List<ApproverDepartmentResponse> findApproverDepartments() {
        return approvalQueryService.findApproverDepartments();
    }
}
