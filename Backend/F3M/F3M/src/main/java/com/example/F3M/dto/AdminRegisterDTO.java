package com.example.F3M.dto;

import lombok.Data;

@Data
public class AdminRegisterDTO {

    private String name;
    private String email;
    private String password;
    private String phone;
    private String role;

    // Farmer & Supervisor
    private String village;

    // Farmer
    private String farmName;
    private Double farmSize;
    private Double latitude;
    private Double longitude;
    private Long supervisorId; // 🔥 IMPORTANT

    // Buyer
    private String companyName;
    private String address;
}