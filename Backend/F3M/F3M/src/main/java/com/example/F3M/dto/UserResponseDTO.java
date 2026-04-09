package com.example.F3M.dto;

import com.example.F3M.enums.Role;
import lombok.Data;

import java.util.List;

@Data
public class UserResponseDTO {

    private Long id;
    private String name;
    private String email;
    private String phone;
    private Role role;

    private List<FarmerDTO> farmers;
    private List<BuyerDTO> buyers;
}