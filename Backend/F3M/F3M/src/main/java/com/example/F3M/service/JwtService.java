package com.example.F3M.service;

import com.example.F3M.config.JwtUtil;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class JwtService {

    private final Key key;

    public JwtService(JwtUtil jwtUtil) {
        this.key = jwtUtil.getKey();
    }

    // ✅ Extract username (email)
    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }

    // ✅ Extract all claims
    public Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // ✅ Check if token is expired
    public boolean isTokenExpired(String token) {
        try {
            return extractAllClaims(token).getExpiration().before(new Date());
        } catch (ExpiredJwtException e) {
            return true;
        }
    }

    // ✅ FIXED: Extract roles safely (handles both "roles" and "role")
    public List<String> extractRoles(String token) {
        Claims claims = extractAllClaims(token);

        List<String> roles = new ArrayList<>();

        // Case 1: roles as List
        Object rolesObj = claims.get("roles");
        if (rolesObj instanceof List) {
            roles = (List<String>) rolesObj;
        }

        // Case 2: single role as String
        Object roleObj = claims.get("role");
        if (roleObj instanceof String) {
            roles.add((String) roleObj);
        }

        return roles;
    }

    // ✅ Optional: extract single role (fallback helper)
    public String extractSingleRole(String token) {
        Claims claims = extractAllClaims(token);
        Object role = claims.get("role");
        return role != null ? role.toString() : null;
    }

    // ✅ Validate token
    public boolean isTokenValid(String token, String username) {
        final String extractedUsername = extractUsername(token);
        return (extractedUsername.equals(username) && !isTokenExpired(token));
    }
}