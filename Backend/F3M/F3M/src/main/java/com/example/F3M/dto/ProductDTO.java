package com.example.F3M.dto;

import lombok.*;

import java.time.LocalDateTime;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDTO {

    private Long id;

    private String productName;
    private String productCategory;
    private String description;
    private Double pricePerKg;
    private String farmName;
    private Double quantityAvailable;
    private String unit;
    private String imageUrl;
    private String variety;
    private Double latitude;
    private Double longitude;

    // ✅ Keep as String (frontend friendly)
    private String status;

    private LocalDateTime createdAt;
    private Boolean organic;
    private Boolean seasonal;
    private Long farmerId;
    private String supervisorName;
    private String supervisorPhone;
}