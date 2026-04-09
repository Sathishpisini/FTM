package com.example.F3M.config;

import com.example.F3M.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    public JwtAuthFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        // Skip multipart requests
        if (request.getContentType() != null &&
                request.getContentType().startsWith("multipart/form-data")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String authHeader = request.getHeader("Authorization");

        System.out.println("===== JWT FILTER START =====");
        System.out.println("Authorization Header: " + authHeader);

        // ✅ No header or invalid format
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println("No Bearer token found");
            filterChain.doFilter(request, response);
            return;
        }

        try {
            String token = authHeader.substring(7).trim();

            // ✅ Extra safety: empty token check
            if (token.isEmpty()) {
                System.out.println("Empty JWT token");
                filterChain.doFilter(request, response);
                return;
            }

            // ✅ Basic JWT structure validation (must have 2 dots)
            if (token.chars().filter(ch -> ch == '.').count() != 2) {
                System.out.println("Invalid JWT format");
                filterChain.doFilter(request, response);
                return;
            }

            System.out.println("Extracted Token: " + token);

            String username = jwtService.extractUsername(token);
            System.out.println("Username from token: " + username);

            List<String> roles = jwtService.extractRoles(token);

            if (roles == null) {
                roles = new ArrayList<>();
            }

            if (roles.isEmpty()) {
                String singleRole = jwtService.extractSingleRole(token);
                if (singleRole != null) {
                    roles = Collections.singletonList(singleRole);
                }
            }

            System.out.println("Roles from token: " + roles);

            if (username != null &&
                    SecurityContextHolder.getContext().getAuthentication() == null &&
                    jwtService.isTokenValid(token, username)) {

                List<SimpleGrantedAuthority> authorities =
                        roles.stream()
                                .filter(role -> role != null && !role.isEmpty())
                                .map(role -> new SimpleGrantedAuthority("ROLE_" + role))
                                .collect(Collectors.toList());

                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                username,
                                null,
                                authorities
                        );

                authToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );

                SecurityContextHolder.getContext().setAuthentication(authToken);

                System.out.println("Authentication set in SecurityContext");
            } else {
                System.out.println("Authentication NOT set (validation failed)");
            }

        } catch (Exception e) {
            System.out.println("JWT ERROR: " + e.getMessage());
            e.printStackTrace();
        }

        System.out.println("===== JWT FILTER END =====");
        filterChain.doFilter(request, response);
    }
}