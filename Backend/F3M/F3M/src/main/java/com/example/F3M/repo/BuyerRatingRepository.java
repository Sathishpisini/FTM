package com.example.F3M.repo;

import com.example.F3M.model.BuyerRating;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BuyerRatingRepository extends JpaRepository<BuyerRating, Long> {

    List<BuyerRating> findByFarmerId(Long farmerId);

    List<BuyerRating> findByBuyerId(Long buyerId);
}