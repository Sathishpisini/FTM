package com.example.F3M.controller;

import com.example.F3M.dto.FarmDTO;
import com.example.F3M.dto.FarmSelectDTO;
import com.example.F3M.dto.FarmerDTO;
import com.example.F3M.enums.RequestStatus;
import com.example.F3M.model.Farmer;
import com.example.F3M.model.User;
import com.example.F3M.repo.UserRepository;
import com.example.F3M.service.FarmerService;
import com.example.F3M.config.JwtUtil;

import org.springframework.security.core.Authentication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/farmers")
@CrossOrigin

public class FarmerController {

    private final FarmerService farmerService;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    public FarmerController(FarmerService farmerService,UserRepository userRepository, JwtUtil jwtUtil) {
        this.farmerService = farmerService;
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    // ================= CREATE FARMER =================
    @PostMapping
    public ResponseEntity<FarmerDTO> createFarmer(@RequestBody FarmerDTO dto) {
        return ResponseEntity.ok(farmerService.createFarmer(dto));
    }
    @GetMapping
    public List<FarmerDTO> getFarmers(
            @RequestParam(required = false) RequestStatus status) {

        if (status != null) {
            return farmerService.getFarmersByStatus(status);
        }

        return farmerService.getAllFarmers();
    }
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestParam RequestStatus status) {

        farmerService.updateStatus(id, status);
        return ResponseEntity.ok("Status updated");
    }
    // ================= GET FARMS BY USER =================
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<FarmerDTO>> getFarmsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(farmerService.getFarmersByUserId(userId));
    }

    @GetMapping("/supervisor/pending")   // ✅ FIXED URL
    public ResponseEntity<List<FarmerDTO>> getSupervisorPendingFarmers(Authentication auth) {

        if (auth == null) {
            throw new RuntimeException("Unauthorized");
        }

        String email = auth.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(
                farmerService.getPendingFarmersBySupervisor(user.getId())
        );
    }

    // ================= GET FARMER BY ID =================
    @GetMapping("/{id}")
    public ResponseEntity<FarmerDTO> getFarmerById(@PathVariable Long id) {
        return ResponseEntity.ok(farmerService.getFarmerById(id));
    }

    // ================= UPDATE FARMER =================
    @PutMapping("/{id}")
    public ResponseEntity<FarmerDTO> updateFarmer(@PathVariable Long id,
                                                  @RequestBody FarmerDTO dto) {
        return ResponseEntity.ok(farmerService.updateFarmer(id, dto));
    }

    // ================= DELETE FARMER =================
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteFarmer(@PathVariable Long id) {
        farmerService.deleteFarmer(id);
        return ResponseEntity.ok("Farmer deleted successfully");
    }

    // ================= GET FARMER PRODUCT IDS =================
    @GetMapping("/{farmerId}/products")
    public ResponseEntity<Set<Long>> getFarmerProducts(@PathVariable Long farmerId) {
        return ResponseEntity.ok(farmerService.getFarmerProducts(farmerId));
    }

    // ================= GET MY FARMS =================
    @GetMapping("/my-farms")
    public List<FarmDTO> getMyFarm(
            @RequestHeader("Authorization") String token
    ) {
        token = token.replace("Bearer ", "");
        Long userId = jwtUtil.extractUserId(token);

        return farmerService.getMyFarm(userId);
    }
    @GetMapping("/admin/farms")
    public ResponseEntity<List<FarmSelectDTO>> getAllFarmsForAdmin() {
        return ResponseEntity.ok(farmerService.getAllFarmsForAdmin());
    }
    @GetMapping("/supervisor")
    public ResponseEntity<List<FarmerDTO>> getFarmersBySupervisor(
            @RequestHeader("Authorization") String token
    ) {
        token = token.replace("Bearer ", "");

        Long userId = jwtUtil.extractUserId(token);

        return ResponseEntity.ok(
                farmerService.getFarmersBySupervisorUserId(userId)
        );
    }
    // ================= TEST =================
    @GetMapping("/test")
    public String test() {
        return "FARMER WORKING";
    }
}