package com.example.procureflow.security;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@Profile("local")
public class LocalCurrentUserProvider implements CurrentUserProvider {

    private static final UUID LOCAL_USER_ID =
            UUID.fromString("00000000-0000-4000-8000-000000000001");
    private static final UUID LOCAL_DEPARTMENT_ID =
            UUID.fromString("00000000-0000-4000-8000-000000000101");

    @Override
    public CurrentUser getCurrentUser() {
        return new CurrentUser(LOCAL_USER_ID, LOCAL_DEPARTMENT_ID);
    }
}
