package com.example.procureflow.request.infrastructure;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.Instant;
import java.util.UUID;

@Mapper
public interface RequestStatusHistoryMapper {

    int insert(
            @Param("id") UUID id,
            @Param("requestId") UUID requestId,
            @Param("fromStatus") String fromStatus,
            @Param("toStatus") String toStatus,
            @Param("requestVersion") long requestVersion,
            @Param("changedBy") UUID changedBy,
            @Param("actorRole") String actorRole,
            @Param("changedAt") Instant changedAt
    );
}
