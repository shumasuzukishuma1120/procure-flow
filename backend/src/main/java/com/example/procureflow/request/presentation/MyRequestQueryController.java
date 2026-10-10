package com.example.procureflow.request.presentation;

import com.example.procureflow.request.application.MyRequestQueryService;
import com.example.procureflow.request.presentation.dto.MyRequestListResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.UUID;

@RestController
@RequestMapping("/api/requests")
@RequiredArgsConstructor
public class MyRequestQueryController {

    private final MyRequestQueryService myRequestQueryService;

    @GetMapping
    public MyRequestListResponse findAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate createdFrom,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate createdTo,
            @RequestParam(required = false) UUID categoryId,
            @RequestParam(required = false) UUID supplierId,
            @RequestParam(defaultValue = "UPDATED_DESC") String sort
    ) {
        return myRequestQueryService.findAll(
                page,
                size,
                status,
                keyword,
                createdFrom,
                createdTo,
                categoryId,
                supplierId,
                sort
        );
    }
}
