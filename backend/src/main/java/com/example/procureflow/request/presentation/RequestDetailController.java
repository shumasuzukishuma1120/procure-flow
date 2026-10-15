package com.example.procureflow.request.presentation;

import com.example.procureflow.request.application.RequestDetailQueryService;
import com.example.procureflow.request.presentation.dto.RequestDetailResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/requests")
@RequiredArgsConstructor
public class RequestDetailController {

    private final RequestDetailQueryService requestDetailQueryService;

    @GetMapping("/{requestId}")
    public RequestDetailResponse findById(@PathVariable UUID requestId) {
        return requestDetailQueryService.findById(requestId);
    }
}
