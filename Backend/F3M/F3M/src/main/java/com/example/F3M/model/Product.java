package com.example.F3M.model;
import com.example.F3M.enums.ProductStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.locationtech.jts.geom.Point;

import java.time.LocalDateTime;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String productName;

    private String productCategory;

    @Column(columnDefinition = "TEXT")
    private String description;

    private Double pricePerKg;
    private Double quantityAvailable;
    private String unit;
    private String imageUrl;
    private String variety;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProductStatus status = ProductStatus.PENDING;

    @Column(columnDefinition = "geography(Point,4326)")
    private Point location;

    // ✅ Keep primitive in DB (safe)
    @Column(nullable = false)
    private boolean organic = false;

    @Column(nullable = false)
    private boolean seasonal = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    @JoinColumn(name = "farmer_id", nullable = false)
    private Farmer farmer;

    @Column(name = "created_at", updatable = false, nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void setCreatedAt() {
        this.createdAt = LocalDateTime.now();
    }
}