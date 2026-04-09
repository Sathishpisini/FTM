package com.example.F3M.repo;

import com.example.F3M.model.Product;
import com.example.F3M.enums.ProductStatus;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT p FROM Product p WHERE p.id = :id")
    Optional<Product> findByIdForUpdate(@Param("id") Long id);

    List<Product> findByFarmerId(Long farmerId);

    List<Product> findByFarmerIdIn(List<Long> farmerIds);

    List<Product> findByCreatedAtAfter(LocalDateTime date);

    // ✅ NEW METHODS (IMPORTANT)
    List<Product> findByStatus(ProductStatus status);
    List<Product> findBySeasonalTrueAndStatus(ProductStatus status);
    List<Product> findByOrganicTrueAndStatus(ProductStatus status);

    List<Product> findByStatusAndCreatedAtAfter(ProductStatus status, LocalDateTime date);

    List<Product> findByFarmerIdInAndStatus(List<Long> farmerIds, ProductStatus status);
}