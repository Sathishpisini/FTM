package com.example.F3M.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    // ✅ Strong secret (>= 32 chars)
    private static final String SECRET = "mysecretkeymysecretkeymysecretkey12345";

    private final Key key = Keys.hmacShaKeyFor(SECRET.getBytes());

    // ================= GENERATE TOKEN =================
    public String generateToken(Long userId, String email, String role) {
        return Jwts.builder()
                .setSubject(email)
                .claim("userId", userId)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 1 day
                .signWith(key)
                .compact();
    }

    // ================= COMMON METHOD (🔥 IMPORTANT) =================
    private Claims extractAllClaims(String token) {

        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // ================= EXTRACT USER ID =================
    public Long extractUserId(String token) {

        Object userId = extractAllClaims(token).get("userId");

        if (userId == null) {
            throw new RuntimeException("userId not found in token");
        }

        return Long.parseLong(userId.toString());
    }

    // ================= EXTRACT ROLE =================
    public String extractRole(String token) {

        String role = extractAllClaims(token).get("role", String.class);

        if (role == null) {
            throw new RuntimeException("role not found in token");
        }

        return role;
    }

    // ================= EXTRACT EMAIL =================
    public String extractEmail(String token) {
        return extractAllClaims(token).getSubject();
    }

    // ================= EXTRACT USERNAME =================
    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }

    // ================= EXPOSE KEY =================
    public Key getKey() {
        return key;
    }
}