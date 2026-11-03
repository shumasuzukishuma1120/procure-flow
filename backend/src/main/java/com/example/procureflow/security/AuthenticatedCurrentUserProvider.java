package com.example.procureflow.security;

import com.example.procureflow.common.error.ApiException;
import com.example.procureflow.user.infrastructure.AuthenticatedUserRow;
import com.example.procureflow.user.infrastructure.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

import java.util.EnumSet;
import java.util.List;
import java.util.Set;

@Component
@Profile("auth & !local-no-auth")
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

        AuthenticatedUserRow user = userMapper.findActiveByCognitoSub(jwt.getSubject());
        if (user == null) {
            throw new ApiException(
                    HttpStatus.UNAUTHORIZED,
                    "USER_NOT_FOUND",
                    "認証ユーザーに対応する有効なユーザーが見つかりません。"
            );
        }

        List<String> cognitoGroups = jwt.getClaimAsStringList("cognito:groups");
        Set<UserRole> roles = EnumSet.noneOf(UserRole.class);
        if (cognitoGroups != null) {
            cognitoGroups.forEach(group -> {
                try {
                    roles.add(UserRole.valueOf(group));
                } catch (IllegalArgumentException ignored) {
                    // Cognitoに業務外のGroupが追加されても、権限としては採用しない。
                }
            });
        }

        return new CurrentUser(
                user.id(),
                user.departmentId(),
                user.employeeNumber(),
                user.displayName(),
                user.departmentName(),
                roles
        );
    }
}
