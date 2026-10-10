package com.example.procureflow.request.infrastructure;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface PurchaseRequestMapper {

    int insert(PurchaseRequestRow request);
}
