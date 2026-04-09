package com.example.F3M.dto;

import com.example.F3M.enums.Role;
import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder   // ✅ ADD THIS
public class UserDTO {
    private Long id;
    private String name;
    private String email;
    private String password;
    private String phone;
    private Role role;
    private List<FarmerDTO> farmers;
    private List<BuyerDTO> buyers;
}