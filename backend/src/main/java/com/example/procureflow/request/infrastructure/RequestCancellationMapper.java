package com.example.procureflow.request.infrastructure;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.Instant;
import java.util.UUID;

@Mapper
public interface RequestCancellationMapper {

    int insert(
            @Param("id") UUID id,
            @Param("requestId") UUID requestId,
            @Param("canceledBy") UUID canceledBy,
            @Param("cancelReason") String cancelReason,
            @Param("canceledAt") Instant canceledAt
    );
}
