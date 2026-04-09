package com.example.F3M.config;

import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Configuration;

@Configuration
public class TomcatConfig {

    @PostConstruct
    public void init() {
        System.out.println("Tomcat custom config loaded");
    }
}
