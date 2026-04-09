package com.example.F3M.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BuyerRatingDTO {

    private Long id;   // ✅ ADDED

    private Integer rating;
    private String review;

    private Long farmerId;
    private Long buyerId;
}