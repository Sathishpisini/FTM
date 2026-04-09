package com.example.F3M.controller;

import com.example.F3M.dto.BuyerDTO;
import com.example.F3M.dto.BuyerDetailsDTO;
import com.example.F3M.enums.RequestStatus;
import com.example.F3M.model.Buyer;
import com.example.F3M.model.Company;
import com.example.F3M.model.User;
import com.example.F3M.repo.BuyerRepository;
import com.example.F3M.repo.UserRepository;
import com.example.F3M.service.BuyerService;
import org.springframework.security.core.Authentication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.Collections;
import java.util.List;
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/buyers")

public class BuyerController {
    private final UserRepository userRepository;
    private final BuyerRepository buyerRepository;
    private final BuyerService buyerService;

    public BuyerController(BuyerService buyerService,BuyerRepository buyerRepository, UserRepository userRepository) {
        this.buyerService = buyerService;
        this.userRepository = userRepository;
        this.buyerRepository = buyerRepository;
    }

    // ✅ CREATE GS
    @PostMapping
    public ResponseEntity<BuyerDTO> createBuyer(@RequestBody BuyerDTO dto) {
        return ResponseEntity.ok(buyerService.createBuyer(dto));
    }
    @GetMapping
    public ResponseEntity<List<BuyerDTO>> getBuyers(
            @RequestParam(required = false) String status) {

        // If status is passed → filter
        if (status != null) {
            RequestStatus requestStatus = RequestStatus.valueOf(status.toUpperCase());
            return ResponseEntity.ok(
                    buyerService.getBuyersByStatus(requestStatus)
            );
        }

        // If no status → return all buyers
        return ResponseEntity.ok(
                buyerService.getAllBuyers()
        );
    }
    @GetMapping("/active")
    public ResponseEntity<List<BuyerDTO>> getApprovedAndPendingBuyers() {
        return ResponseEntity.ok(
                buyerService.getApprovedAndPendingBuyers()
        );
    }
    //GS
    @PutMapping("/{id}/status")
    public ResponseEntity<BuyerDTO> updateBuyerStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        RequestStatus requestStatus;

        try {
            requestStatus = RequestStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }

        BuyerDTO updatedBuyer = buyerService.updateBuyerStatus(id, requestStatus);

        return ResponseEntity.ok(updatedBuyer);
    }
    @GetMapping("/{userId}/companies")
    public ResponseEntity<List<Company>> getCompaniesByUserId(@PathVariable Long userId) {
        // Fetch companies for the given buyer/userId
        List<Company> companies = buyerService.getCompaniesByUserId(userId);
        return ResponseEntity.ok(companies);
    }

    // ✅ GET ONLY APPROVED COMPANIES (BUYERS)
    @GetMapping("/users/{userId}/approved")
    public ResponseEntity<List<BuyerDTO>> getApprovedBuyers(@PathVariable Long userId) {

        return ResponseEntity.ok(
                buyerService.getApprovedBuyersByUser(userId)
        );
    }
    @GetMapping("/user/{userId}")
    public List<BuyerDetailsDTO> getBuyerDetailsByUserId(@PathVariable Long userId) {
        return buyerService.getBuyerDetailsByUserId(userId);
    }
    // ✅ GET BY ID
    @GetMapping("/{buyerId}")
    public ResponseEntity<BuyerDTO> getBuyerById(@PathVariable Long buyerId) {
        return ResponseEntity.ok(buyerService.getBuyerById(buyerId));
    }

    // ✅ UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<BuyerDTO> updateBuyer(
            @PathVariable Long id,
            @RequestBody BuyerDTO dto) {

        return ResponseEntity.ok(buyerService.updateBuyer(id, dto));
    }

    // ✅ DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteBuyer(@PathVariable Long id) {

        buyerService.deleteBuyer(id);
        return ResponseEntity.ok("Buyer deleted successfully");
    }
    @GetMapping("/users/{userId}")
    public ResponseEntity<?> getBuyersByUserId(@PathVariable Long userId) {

        List<Buyer> buyers = buyerRepository.findByUser_Id(userId);

        if (buyers == null || buyers.isEmpty()) {
            return ResponseEntity.ok(Collections.emptyList());
        }

        return ResponseEntity.ok(buyers); // ✅ RETURN FULL LIST
    }

    // ✅ TEST
    @GetMapping("/test")
    public String test() {
        return "BUYER WORKING";
    }
}