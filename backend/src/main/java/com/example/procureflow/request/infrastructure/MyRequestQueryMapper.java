package com.example.procureflow.request.infrastructure;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface MyRequestQueryMapper {

    List<MyRequestListItemRow> findAll(@Param("criteria") MyRequestSearchCriteria criteria);

    long count(@Param("criteria") MyRequestSearchCriteria criteria);
}
