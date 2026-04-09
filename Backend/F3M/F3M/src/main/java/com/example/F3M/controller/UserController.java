package com.example.F3M.controller;

import com.example.F3M.dto.*;
import com.example.F3M.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // ================= REGISTER =================
    @PostMapping("/register")
    public ResponseEntity<UserDTO> register(@RequestBody RegisterRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(userService.register(request));
    }

    // ================= LOGIN =================
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO request) {
        try {
            AuthResponse response = userService.login(
                    request.getEmailOrPhone(),
                    request.getPassword()
            );
            return ResponseEntity.ok(response);

        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", ex.getMessage())   // ✅ JSON
            );
        }
    }

    // ================= GET ALL USERS =================
    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // ================= GET USER BY ID =================
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        try {
            UserResponseDTO user = userService.getUserById(id);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        }
    }

    // ================= BASIC GET =================
    @GetMapping("/basic/{id}")
    public ResponseEntity<?> getUserBasic(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(userService.getUserBasicById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        }
    }

    // ================= UPDATE =================
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id,
                                        @RequestBody UserDTO dto) {
        try {
            return ResponseEntity.ok(userService.updateUser(id, dto));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        }
    }

    // ================= DELETE =================
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok("User deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        }
    }

    // ================= OAUTH =================
    @GetMapping("/oauth-success")
    public ResponseEntity<String> oauthSuccess() {
        return ResponseEntity.ok("Login successful with Google");
    }

    // ================= TEST =================
    @GetMapping("/test")
    public String test() {
        return "USER WORKING";
    }
}