package com.example.procureflow.security;

import com.example.procureflow.user.infrastructure.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@Profile("local")
@RequiredArgsConstructor
public class LocalCognitoUserBinder implements ApplicationRunner {

    private static final UUID LOCAL_USER_ID =
            UUID.fromString("00000000-0000-4000-8000-000000000001");

    private final UserMapper userMapper;

    @Value("${app.security.local-cognito-sub:}")
    private String localCognitoSub;

    @Override
    public void run(ApplicationArguments args) {
        if (!localCognitoSub.isBlank()) {
            userMapper.updateCognitoSub(LOCAL_USER_ID, localCognitoSub);
        }
    }
}
