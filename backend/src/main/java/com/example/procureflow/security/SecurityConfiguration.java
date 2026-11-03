package com.example.procureflow.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.core.convert.converter.Converter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtDecoders;
import org.springframework.security.oauth2.jwt.JwtValidators;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableMethodSecurity
@Profile("auth & !local-no-auth")
@RequiredArgsConstructor
public class SecurityConfiguration {

    private final SecurityProblemResponseWriter problemWriter;

    @Value("${spring.security.oauth2.resourceserver.jwt.issuer-uri}")
    private String issuerUri;

    @Value("${app.security.cognito-client-id}")
    private String cognitoClientId;

    @Bean
    SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            Converter<Jwt, ? extends AbstractAuthenticationToken> jwtAuthenticationConverter
    ) throws Exception {
        return http
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers(HttpMethod.GET, "/actuator/health").permitAll()
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/approvals/**").hasRole("APPROVER")
                        .requestMatchers("/api/purchases/**").hasRole("PURCHASER")
                        .requestMatchers("/api/requests/**", "/api/request-submissions/**")
                        .hasRole("USER")
                        .anyRequest().authenticated())
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter))
                        .authenticationEntryPoint((request, response, exception) ->
                                problemWriter.write(
                                        response,
                                        HttpStatus.UNAUTHORIZED,
                                        "AUTHENTICATION_REQUIRED",
                                        "認証が必要です。"
                                )))
                .exceptionHandling(exceptions -> exceptions
                        .accessDeniedHandler((request, response, exception) ->
                                problemWriter.write(
                                        response,
                                        HttpStatus.FORBIDDEN,
                                        "ACCESS_DENIED",
                                        "この操作を実行する権限がありません。"
                                )))
                .build();
    }

    @Bean
    Converter<Jwt, ? extends AbstractAuthenticationToken> jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter authoritiesConverter =
                new JwtGrantedAuthoritiesConverter();
        authoritiesConverter.setAuthoritiesClaimName("cognito:groups");
        authoritiesConverter.setAuthorityPrefix("ROLE_");

        JwtAuthenticationConverter authenticationConverter =
                new JwtAuthenticationConverter();
        authenticationConverter.setJwtGrantedAuthoritiesConverter(authoritiesConverter);
        return authenticationConverter;
    }

    @Bean
    JwtDecoder jwtDecoder() {
        NimbusJwtDecoder decoder = JwtDecoders.fromIssuerLocation(issuerUri);
        OAuth2TokenValidator<Jwt> issuerValidator =
                JwtValidators.createDefaultWithIssuer(issuerUri);
        OAuth2TokenValidator<Jwt> cognitoAccessTokenValidator = jwt -> {
            boolean isAccessToken = "access".equals(jwt.getClaimAsString("token_use"));
            boolean isExpectedClient =
                    cognitoClientId.equals(jwt.getClaimAsString("client_id"));

            if (isAccessToken && isExpectedClient) {
                return OAuth2TokenValidatorResult.success();
            }

            OAuth2Error error = new OAuth2Error(
                    "invalid_token",
                    "Cognito Access Tokenの用途またはClient IDが不正です。",
                    null
            );
            return OAuth2TokenValidatorResult.failure(error);
        };

        decoder.setJwtValidator(new DelegatingOAuth2TokenValidator<>(
                issuerValidator,
                cognitoAccessTokenValidator
        ));
        return decoder;
    }
}
