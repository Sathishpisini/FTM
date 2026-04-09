package com.example.F3M.dto;

import com.example.F3M.enums.RequestStatus;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BuyerDTO {

    private Long id;
    private Long userId;
    private String companyName;
    private String address;
    private RequestStatus status;
    // Geo coordinates
    private Double latitude;
    private Double longitude;
}