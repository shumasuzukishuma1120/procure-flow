package com.example.procureflow.security;

import com.example.procureflow.approval.application.ApprovalQueryService;
import com.example.procureflow.approval.presentation.ApprovalQueryController;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ApprovalQueryController.class)
@Import({SecurityConfiguration.class, SecurityProblemResponseWriter.class})
@ActiveProfiles("auth")
@TestPropertySource(properties = {
        "spring.security.oauth2.resourceserver.jwt.issuer-uri=https://cognito-idp.ap-northeast-1.amazonaws.com/test-pool",
        "app.security.cognito-client-id=test-client"
})
class SecurityConfigurationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ApprovalQueryService approvalQueryService;

    @MockitoBean
    private JwtDecoder jwtDecoder;

    @Test
    void 未認証で承認一覧を取得すると401を返す() throws Exception {
        mockMvc.perform(get("/api/approvals"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("AUTHENTICATION_REQUIRED"));

        verifyNoInteractions(approvalQueryService);
    }

    @Test
    void userロールで承認一覧を取得すると403を返す() throws Exception {
        mockMvc.perform(get("/api/approvals")
                        .with(jwt().authorities(new SimpleGrantedAuthority("ROLE_USER"))))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.code").value("ACCESS_DENIED"));

        verifyNoInteractions(approvalQueryService);
    }

    @Test
    void approverロールで承認一覧を取得するとControllerへ到達する() throws Exception {
        mockMvc.perform(get("/api/approvals")
                        .with(jwt().authorities(new SimpleGrantedAuthority("ROLE_APPROVER"))))
                .andExpect(status().isOk());

        verify(approvalQueryService).findAll(
                0,
                20,
                null,
                null,
                null,
                null,
                false,
                "OLDEST"
        );
    }
}
