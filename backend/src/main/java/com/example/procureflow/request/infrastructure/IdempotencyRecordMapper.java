package com.example.procureflow.request.infrastructure;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.Instant;
import java.util.UUID;

@Mapper
public interface IdempotencyRecordMapper {

    int insertProcessingIfAbsent(
            @Param("id") UUID id,
            @Param("userId") UUID userId,
            @Param("operationType") String operationType,
            @Param("idempotencyKey") String idempotencyKey,
            @Param("requestHash") String requestHash,
            @Param("createdAt") Instant createdAt,
            @Param("expiresAt") Instant expiresAt
    );

    IdempotencyRecord find(
            @Param("userId") UUID userId,
            @Param("operationType") String operationType,
            @Param("idempotencyKey") String idempotencyKey
    );

    int complete(
            @Param("userId") UUID userId,
            @Param("operationType") String operationType,
            @Param("idempotencyKey") String idempotencyKey,
            @Param("resourceId") UUID resourceId,
            @Param("responseStatus") int responseStatus,
            @Param("responseBody") String responseBody
    );
}
