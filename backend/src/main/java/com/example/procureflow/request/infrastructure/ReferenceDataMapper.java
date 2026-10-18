package com.example.procureflow.request.infrastructure;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@Mapper
public interface ReferenceDataMapper {

    boolean existsActiveSupplier(@Param("supplierId") UUID supplierId);

    String findActiveSupplierName(@Param("supplierId") UUID supplierId);

    String findDepartmentName(@Param("departmentId") UUID departmentId);

    List<UUID> findActiveCategoryIds(@Param("categoryIds") Set<UUID> categoryIds);
}
