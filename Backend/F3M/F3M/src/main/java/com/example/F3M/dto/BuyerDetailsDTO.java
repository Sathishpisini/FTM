package com.example.F3M.dto;

import com.example.F3M.enums.Role;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BuyerDetailsDTO {

    // User info
    private Long userId;
    private String name;
    private String email;
    private String phone;
    private Role role;

    // Buyer (company) info
    private Long buyerId;
    private String companyName;
    private String address;

    private Double latitude;
    private Double longitude;
}