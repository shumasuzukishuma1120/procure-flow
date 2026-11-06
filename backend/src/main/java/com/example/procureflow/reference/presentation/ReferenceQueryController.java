package com.example.procureflow.reference.presentation;
import com.example.procureflow.reference.application.ReferenceQueryService;
import com.example.procureflow.reference.presentation.dto.ReferenceOptionResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController @RequestMapping("/api/reference-data") @RequiredArgsConstructor
public class ReferenceQueryController {
    private final ReferenceQueryService service;
    @GetMapping("/categories")
    public List<ReferenceOptionResponse> findActiveCategories() { return service.findActiveCategories(); }
    @GetMapping("/suppliers")
    public List<ReferenceOptionResponse> findActiveSuppliers() { return service.findActiveSuppliers(); }
}
