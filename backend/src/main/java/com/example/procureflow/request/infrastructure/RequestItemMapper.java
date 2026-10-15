package com.example.procureflow.request.infrastructure;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.UUID;

@Mapper
public interface RequestItemMapper {

    int insert(RequestItemRow item);

    List<RequestItemRow> findByRequestId(@Param("requestId") UUID requestId);

    int deleteByRequestId(@Param("requestId") UUID requestId);
}
