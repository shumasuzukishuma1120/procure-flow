package com.example.procureflow.request.infrastructure;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.Instant;
import java.util.UUID;

@Mapper
public interface PurchaseRequestMapper {

    int insert(PurchaseRequestRow request);

    RequestDetailRow findOwnedRequest(
            @Param("requestId") UUID requestId,
            @Param("applicantId") UUID applicantId
    );

    int updateOwnedDraft(DraftRequestUpdateRow request);

    int submitOwnedDraft(SubmitDraftUpdateRow request);

    long nextRequestNumberSequence();

    OwnedRequestStateRow findOwnedState(
            @Param("requestId") UUID requestId,
            @Param("applicantId") UUID applicantId
    );

    int deleteOwnedDraft(
            @Param("requestId") UUID requestId,
            @Param("applicantId") UUID applicantId,
            @Param("version") long version
    );

    int cancelOwnedSubmitted(
            @Param("requestId") UUID requestId,
            @Param("applicantId") UUID applicantId,
            @Param("version") long version,
            @Param("updatedAt") Instant updatedAt
    );
}
