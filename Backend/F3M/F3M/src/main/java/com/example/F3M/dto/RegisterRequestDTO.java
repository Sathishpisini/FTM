package com.example.F3M.dto;

import com.example.F3M.enums.Role;
import lombok.Data;

@Data
public class RegisterRequestDTO {

    // ✅ User fields
    private String name;
    private String email;
    private String password;
    private String phone;
    private Role role;

    private String village;
    private String farmName;
    private Double farmSize;

    private String companyName;
    private String address;

    private Double latitude;
    private Double longitude;

}