package com.example.procureflow.common.config;

import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.time.Duration;

@Configuration
@EnableCaching
public class CacheConfiguration {
    @Bean
    CacheManager cacheManager() {
        CaffeineCacheManager manager = new CaffeineCacheManager("activeCategories", "activeSuppliers");
        manager.setCaffeine(Caffeine.newBuilder().maximumSize(100).expireAfterWrite(Duration.ofHours(1)));
        return manager;
    }
}
