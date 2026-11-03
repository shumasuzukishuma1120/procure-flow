package com.example.procureflow.security.presentation;

import com.example.procureflow.security.CurrentUser;
import com.example.procureflow.security.CurrentUserProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/me")
@RequiredArgsConstructor
public class CurrentUserController {

    private final CurrentUserProvider currentUserProvider;

    @GetMapping
    public CurrentUserResponse getCurrentUser() {
        CurrentUser currentUser = currentUserProvider.getCurrentUser();

        return new CurrentUserResponse(
                currentUser.id(),
                currentUser.employeeNumber(),
                currentUser.displayName(),
                new CurrentUserResponse.DepartmentResponse(
                        currentUser.departmentId(),
                        currentUser.departmentName()
                ),
                currentUser.roles().stream()
                        .map(Enum::name)
                        .sorted()
                        .toList()
        );
    }
}
