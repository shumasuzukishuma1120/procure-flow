package com.example.procureflow;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles({"local", "local-no-auth"})
class BackendApplicationTests {

    @Test
    void contextLoads() {
    }

}
