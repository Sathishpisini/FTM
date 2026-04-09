package com.example.F3M.config;

import com.example.F3M.config.JwtAuthFilter; // ✅ ADD THIS IMPORT

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.http.HttpMethod;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authorizeHttpRequests(auth -> auth

                        // ✅ PUBLIC ENDPOINTS
                        .requestMatchers(
                                "/api/users/**",
                                "/api/carousel/**",
                                "/api/farmers/**",
                                "/api/farmers/my-farms",
                                "/api/buyers/**",
                                "/api/buyers/users/**",
                                "/api/farms/**",
                                "/api/orders/**",
                                "/api/order-items/**",
                                "/uploads/**",
                                "/api/supervisors/**",
                                "/api/products/**",
                                "/api/farmer-products",
                                "/oauth2/**"
                        ).permitAll()

                        // ✅ PRODUCT ACCESS CONTROL
                        .requestMatchers(HttpMethod.GET, "/api/products/**")
                        .permitAll()

                        // ✅ AUTH REQUIRED FOR OTHERS
                        .anyRequest().authenticated()
                )

                .oauth2Login(oauth -> oauth
                        .defaultSuccessUrl("http://localhost:5173/home", true)
                )

                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)

                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setStatus(401);
                            response.getWriter().write("Unauthorized");
                        })
                );

        return http.build();
    }
}