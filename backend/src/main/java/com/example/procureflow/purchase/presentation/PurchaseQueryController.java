package com.example.procureflow.purchase.presentation;

import com.example.procureflow.purchase.application.PurchaseQueryService;
import com.example.procureflow.purchase.presentation.dto.PurchaseDetailResponse;
import com.example.procureflow.purchase.presentation.dto.PurchaseDepartmentResponse;
import com.example.procureflow.purchase.presentation.dto.PurchaseListResponse;
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
@RequestMapping("/api/purchases")
@RequiredArgsConstructor
public class PurchaseQueryController {
    private final PurchaseQueryService service;

    @GetMapping
    public PurchaseListResponse findAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "DELIVERY_DATE_ASC") String sort,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) UUID departmentId,
            @RequestParam(required = false) UUID supplierId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate approvedFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate approvedTo
    ) {
        return service.findAll(page, size, sort, status, keyword, departmentId,
                supplierId, approvedFrom, approvedTo);
    }

    @GetMapping("/{requestId}")
    public PurchaseDetailResponse findById(@PathVariable UUID requestId) {
        return service.findById(requestId);
    }

    @GetMapping("/departments")
    public List<PurchaseDepartmentResponse> findActiveDepartments() {
        return service.findActiveDepartments();
    }
}
