package com.example.F3M.controller;

import com.example.F3M.dto.BuyerRatingDTO;
import com.example.F3M.service.BuyerRatingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ratings")
public class BuyerRatingController {

    private final BuyerRatingService ratingService;

    public BuyerRatingController(BuyerRatingService ratingService) {
        this.ratingService = ratingService;
    }

    // ✅ CREATE
    @PostMapping
    public ResponseEntity<BuyerRatingDTO> addRating(@RequestBody BuyerRatingDTO dto) {
        return ResponseEntity.ok(ratingService.addRating(dto));
    }

    // ✅ GET BY FARMER
    @GetMapping("/farmer/{farmerId}")
    public ResponseEntity<List<BuyerRatingDTO>> getRatings(@PathVariable Long farmerId) {
        return ResponseEntity.ok(ratingService.getFarmerRatings(farmerId));
    }

    // ✅ GET ALL
    @GetMapping
    public ResponseEntity<List<BuyerRatingDTO>> getAllRatings() {
        return ResponseEntity.ok(ratingService.getAllRatings());
    }

    // ✅ UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<BuyerRatingDTO> updateRating(
            @PathVariable Long id,
            @RequestBody BuyerRatingDTO dto) {

        return ResponseEntity.ok(ratingService.updateRating(id, dto));
    }

    // ✅ DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteRating(@PathVariable Long id) {
        ratingService.deleteRating(id);
        return ResponseEntity.ok("Rating deleted successfully");
    }

    // ✅ TEST
    @GetMapping("/test")
    public String test() {
        return "RATING WORKING";
    }
}