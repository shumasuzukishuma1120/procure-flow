package com.example.procureflow.request.presentation;

import com.example.procureflow.request.application.RequestSubmissionService;
import com.example.procureflow.request.presentation.dto.CreateRequestSubmissionRequest;
import com.example.procureflow.request.presentation.dto.RequestSubmissionResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/request-submissions")
@RequiredArgsConstructor
public class RequestSubmissionController {

    private final RequestSubmissionService requestSubmissionService;

    @PostMapping
    public ResponseEntity<RequestSubmissionResponse> createSubmission(
            @RequestHeader(name = "Idempotency-Key", required = false) String idempotencyKey,
            @Valid @RequestBody CreateRequestSubmissionRequest request
    ) {
        RequestSubmissionResponse response = requestSubmissionService.create(
                idempotencyKey,
                request
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
