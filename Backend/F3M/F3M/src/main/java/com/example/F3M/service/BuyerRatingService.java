package com.example.F3M.service;

import com.example.F3M.dto.BuyerRatingDTO;
import com.example.F3M.model.Buyer;
import com.example.F3M.model.BuyerRating;
import com.example.F3M.model.Farmer;
import com.example.F3M.repo.BuyerRatingRepository;
import com.example.F3M.repo.BuyerRepository;
import com.example.F3M.repo.FarmerRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BuyerRatingService {

    private final BuyerRatingRepository ratingRepository;
    private final BuyerRepository buyerRepository;
    private final FarmerRepository farmerRepository;

    public BuyerRatingService(BuyerRatingRepository ratingRepository,
                              BuyerRepository buyerRepository,
                              FarmerRepository farmerRepository) {
        this.ratingRepository = ratingRepository;
        this.buyerRepository = buyerRepository;
        this.farmerRepository = farmerRepository;
    }

    // ✅ CREATE
    public BuyerRatingDTO addRating(BuyerRatingDTO dto) {

        Buyer buyer = buyerRepository.findById(dto.getBuyerId())
                .orElseThrow(() -> new RuntimeException("Buyer not found"));

        Farmer farmer = farmerRepository.findById(dto.getFarmerId())
                .orElseThrow(() -> new RuntimeException("Farmer not found"));

        BuyerRating rating = BuyerRating.builder()
                .rating(dto.getRating())
                .review(dto.getReview())
                .buyer(buyer)
                .farmer(farmer)
                .build();

        BuyerRating saved = ratingRepository.save(rating);

        return mapToDTO(saved);
    }

    // ✅ GET FARMER RATINGS
    public List<BuyerRatingDTO> getFarmerRatings(Long farmerId) {
        return ratingRepository.findByFarmerId(farmerId)
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    // ✅ GET ALL
    public List<BuyerRatingDTO> getAllRatings() {
        return ratingRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    // ✅ UPDATE
    public BuyerRatingDTO updateRating(Long id, BuyerRatingDTO dto) {

        BuyerRating rating = ratingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rating not found"));

        if (dto.getRating() != null) rating.setRating(dto.getRating());
        if (dto.getReview() != null) rating.setReview(dto.getReview());

        if (dto.getBuyerId() != null) {
            Buyer buyer = buyerRepository.findById(dto.getBuyerId())
                    .orElseThrow(() -> new RuntimeException("Buyer not found"));
            rating.setBuyer(buyer);
        }

        if (dto.getFarmerId() != null) {
            Farmer farmer = farmerRepository.findById(dto.getFarmerId())
                    .orElseThrow(() -> new RuntimeException("Farmer not found"));
            rating.setFarmer(farmer);
        }

        BuyerRating updated = ratingRepository.save(rating);

        return mapToDTO(updated);
    }

    // ✅ DELETE
    public void deleteRating(Long id) {
        BuyerRating rating = ratingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rating not found"));
        ratingRepository.delete(rating);
    }

    // ✅ MAPPER
    private BuyerRatingDTO mapToDTO(BuyerRating rating) {
        return BuyerRatingDTO.builder()
                .id(rating.getId())
                .rating(rating.getRating())
                .review(rating.getReview())
                .farmerId(rating.getFarmer() != null ? rating.getFarmer().getId() : null)
                .buyerId(rating.getBuyer() != null ? rating.getBuyer().getId() : null)
                .build();
    }
}