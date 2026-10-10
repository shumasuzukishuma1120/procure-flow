package com.example.procureflow.common.error;

import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ApiProblemResponse> handleApiException(ApiException exception) {
        return buildResponse(
                exception.status(),
                exception.code(),
                exception.getMessage(),
                exception.fieldErrors()
        );
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiProblemResponse> handleMethodArgumentNotValid(
            MethodArgumentNotValidException exception
    ) {
        List<ApiFieldError> fieldErrors = exception.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> new ApiFieldError(
                        error.getField(),
                        error.getCode() == null ? "INVALID" : error.getCode(),
                        error.getDefaultMessage() == null ? "入力内容が不正です。" : error.getDefaultMessage()
                ))
                .sorted(Comparator.comparing(ApiFieldError::field))
                .toList();

        return buildResponse(
                HttpStatus.BAD_REQUEST,
                "VALIDATION_ERROR",
                "入力内容を確認してください。",
                fieldErrors
        );
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiProblemResponse> handleConstraintViolation(
            ConstraintViolationException exception
    ) {
        List<ApiFieldError> fieldErrors = exception.getConstraintViolations()
                .stream()
                .map(violation -> new ApiFieldError(
                        violation.getPropertyPath().toString(),
                        "INVALID",
                        violation.getMessage()
                ))
                .toList();

        return buildResponse(
                HttpStatus.BAD_REQUEST,
                "VALIDATION_ERROR",
                "入力内容を確認してください。",
                fieldErrors
        );
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ApiProblemResponse> handleMethodArgumentTypeMismatch(
            MethodArgumentTypeMismatchException exception
    ) {
        return buildResponse(
                HttpStatus.BAD_REQUEST,
                "INVALID_QUERY_PARAMETER",
                exception.getName() + "に指定できない値が含まれています。",
                List.of(new ApiFieldError(
                        exception.getName(),
                        "INVALID",
                        "値の形式を確認してください。"
                ))
        );
    }

    private ResponseEntity<ApiProblemResponse> buildResponse(
            HttpStatus status,
            String code,
            String detail,
            List<ApiFieldError> fieldErrors
    ) {
        ApiProblemResponse body = new ApiProblemResponse(
                "https://procure-flow.example/problems/" + code.toLowerCase().replace('_', '-'),
                status.getReasonPhrase(),
                status.value(),
                detail,
                code,
                UUID.randomUUID().toString(),
                fieldErrors
        );

        return ResponseEntity.status(status).body(body);
    }
}
