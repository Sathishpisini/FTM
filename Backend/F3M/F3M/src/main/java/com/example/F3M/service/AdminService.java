package com.example.F3M.service;

import com.example.F3M.dto.AdminRegisterDTO;
import com.example.F3M.dto.BuyerDTO;
import com.example.F3M.dto.FarmerDTO;
import com.example.F3M.enums.Role;
import com.example.F3M.model.User;
import com.example.F3M.repo.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final FarmerService farmerService;
    private final BuyerService buyerService;
    private final SupervisorService supervisorService;

    // ✅ Inject encoder (BEST PRACTICE)
    private final PasswordEncoder passwordEncoder;

    public String registerUser(AdminRegisterDTO dto) {

        // ✅ 1. Create User with ENCRYPTED PASSWORD
        User user = User.builder()
                .name(dto.getName())
                .email(dto.getEmail())
                .password(passwordEncoder.encode(dto.getPassword())) // 🔥 FIXED
                .phone(dto.getPhone())
                .role(Role.valueOf(dto.getRole()))
                .build();

        user = userRepository.save(user);

        // ✅ 2. Role-based logic
        switch (user.getRole()) {

            case FARMER -> {

                FarmerDTO farmerDTO = FarmerDTO.builder()
                        .userId(user.getId())
                        .farmName(dto.getFarmName())
                        .farmSize(dto.getFarmSize())
                        .village(dto.getVillage())
                        .latitude(dto.getLatitude())
                        .longitude(dto.getLongitude())
                        .build();

                farmerService.createFarmer(farmerDTO);
            }

            case BUYER -> {

                BuyerDTO buyerDTO = BuyerDTO.builder()
                        .userId(user.getId())
                        .companyName(dto.getCompanyName())
                        .address(dto.getAddress())
                        .latitude(dto.getLatitude())
                        .longitude(dto.getLongitude())
                        .build();

                buyerService.createBuyer(buyerDTO);
            }

            case SUPERVISOR -> {
                supervisorService.createSupervisor(user, dto);
            }
        }

        return "User registered successfully";
    }
}