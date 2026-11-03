package com.example.procureflow.security;

import java.util.UUID;
import java.util.Set;

public record CurrentUser(
        UUID id,
        UUID departmentId,
        String employeeNumber,
        String displayName,
        String departmentName,
        Set<UserRole> roles
) {
    public CurrentUser {
        roles = Set.copyOf(roles);
    }

    public boolean hasRole(UserRole role) {
        return roles.contains(role);
    }
}
