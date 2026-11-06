package com.example.procureflow.reference.infrastructure;
import com.example.procureflow.reference.presentation.dto.ReferenceOptionResponse;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;
@Mapper
public interface ReferenceQueryMapper {
    List<ReferenceOptionResponse> findActiveCategories();
    List<ReferenceOptionResponse> findActiveSuppliers();
}
