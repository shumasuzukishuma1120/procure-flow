package com.example.procureflow.approval.infrastructure;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.Instant;
import java.util.UUID;

@Mapper
public interface ApprovalCommandMapper {

    int updateDecision(
            @Param("requestId") UUID requestId,
            @Param("approverId") UUID approverId,
            @Param("expectedVersion") long expectedVersion,
            @Param("decision") String decision,
            @Param("updatedAt") Instant updatedAt
    );

    ApprovalRequestStateRow findScopedState(
            @Param("requestId") UUID requestId,
            @Param("approverId") UUID approverId
    );

    int insertDecision(
            @Param("id") UUID id,
            @Param("requestId") UUID requestId,
            @Param("approverId") UUID approverId,
            @Param("decision") String decision,
            @Param("reason") String reason,
            @Param("requestVersion") long requestVersion,
            @Param("decidedAt") Instant decidedAt
    );
}
