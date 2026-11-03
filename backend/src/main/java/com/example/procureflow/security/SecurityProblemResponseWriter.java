package com.example.procureflow.security;

import com.example.procureflow.common.error.ApiProblemResponse;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class SecurityProblemResponseWriter {

    private final ObjectMapper objectMapper;

    public void write(
            HttpServletResponse response,
            HttpStatus status,
            String code,
            String detail
    ) throws IOException {
        ApiProblemResponse body = new ApiProblemResponse(
                "https://procure-flow.example/problems/" + code.toLowerCase().replace('_', '-'),
                status.getReasonPhrase(),
                status.value(),
                detail,
                code,
                UUID.randomUUID().toString(),
                List.of()
        );

        response.setStatus(status.value());
        response.setCharacterEncoding("UTF-8");
        response.setContentType(MediaType.APPLICATION_PROBLEM_JSON_VALUE);
        objectMapper.writeValue(response.getOutputStream(), body);
    }
}
