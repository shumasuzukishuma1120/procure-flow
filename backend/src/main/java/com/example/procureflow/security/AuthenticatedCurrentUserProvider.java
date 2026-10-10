package com.example.procureflow.security;

import com.example.procureflow.common.error.ApiException;
import com.example.procureflow.user.infrastructure.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

@Component
@Profile("!local")
@RequiredArgsConstructor
public class AuthenticatedCurrentUserProvider implements CurrentUserProvider {

    private final UserMapper userMapper;

    @Override
    public CurrentUser getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof Jwt jwt)) {
            throw new ApiException(
                    HttpStatus.UNAUTHORIZED,
                    "AUTHENTICATION_REQUIRED",
                    "認証が必要です。"
            );
        }

        CurrentUser currentUser = userMapper.findActiveByCognitoSub(jwt.getSubject());
        if (currentUser == null) {
            throw new ApiException(
                    HttpStatus.UNAUTHORIZED,
                    "USER_NOT_FOUND",
                    "認証ユーザーに対応する有効なユーザーが見つかりません。"
            );
        }

        return currentUser;
    }
}
