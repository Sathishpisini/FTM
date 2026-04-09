package com.example.F3M.controller;

import com.example.F3M.dto.AdminRegisterDTO;
import com.example.F3M.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    // ✅ CREATE USER + ROLE TABLE ENTRY
    @PostMapping("/register-user")
    public ResponseEntity<?> registerUser(@RequestBody AdminRegisterDTO dto) {

        String response = adminService.registerUser(dto);

        return ResponseEntity.ok(response);
    }
}