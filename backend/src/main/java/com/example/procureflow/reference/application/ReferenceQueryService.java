package com.example.procureflow.reference.application;
import com.example.procureflow.reference.infrastructure.ReferenceQueryMapper;
import com.example.procureflow.reference.presentation.dto.ReferenceOptionResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
@Service @RequiredArgsConstructor @Transactional(readOnly = true)
public class ReferenceQueryService {
    private final ReferenceQueryMapper mapper;
    @Cacheable("activeCategories")
    public List<ReferenceOptionResponse> findActiveCategories() { return List.copyOf(mapper.findActiveCategories()); }
    @Cacheable("activeSuppliers")
    public List<ReferenceOptionResponse> findActiveSuppliers() { return List.copyOf(mapper.findActiveSuppliers()); }
}
