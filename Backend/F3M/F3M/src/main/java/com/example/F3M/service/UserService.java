package com.example.F3M.service;

import com.example.F3M.config.JwtUtil;
import com.example.F3M.dto.*;
import com.example.F3M.model.*;
import com.example.F3M.repo.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final FarmerRepository farmerRepository;
    private final BuyerRepository buyerRepository;
    private final SupervisorRepository supervisorRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public UserService(UserRepository userRepository,
                       FarmerRepository farmerRepository,
                       BuyerRepository buyerRepository,
                       SupervisorRepository supervisorRepository,
                       BCryptPasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.farmerRepository = farmerRepository;
        this.buyerRepository = buyerRepository;
        this.supervisorRepository = supervisorRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    // ================= REGISTER =================
    public UserDTO register(RegisterRequestDTO request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        if (userRepository.existsByPhone(request.getPhone())) {
            throw new RuntimeException("Phone already registered");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(request.getRole())
                .build();

        return mapToDTO(userRepository.save(user));
    }

    // ================= LOGIN =================
    public AuthResponse login(String emailOrPhone, String password) {

        User user;

        if (emailOrPhone.contains("@")) {
            user = userRepository.findByEmail(emailOrPhone)
                    .orElseThrow(() -> new RuntimeException("User not found"));
        } else {
            user = userRepository.findByPhone(emailOrPhone)
                    .orElseThrow(() -> new RuntimeException("User not found"));
        }

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole().name());

        return AuthResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole().name())
                .token(token)
                .build();
    }

    // ================= GET ALL USERS =================
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    // ================= GET USER BY ID (UPDATED FOR MULTIPLE FARMERS & BUYERS) =================
    public UserResponseDTO getUserById(Long id) {

        // ✅ Step 1: Get basic user
        User baseUser = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        User user;

        // ✅ Step 2: Fetch based on role (SAFE - no multiple bag issue)
        switch (baseUser.getRole()) {
            case FARMER -> user = userRepository.findWithFarmersById(id)
                    .orElse(baseUser);

            case BUYER -> user = userRepository.findWithBuyersById(id)
                    .orElse(baseUser);

            default -> user = baseUser;
        }

        UserResponseDTO dto = new UserResponseDTO();

        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setRole(user.getRole());

        // ================= FARMERS =================
        // 🔥 CHANGED: earlier only first farmer → now handling LIST
        if (user.getFarmers() != null && !user.getFarmers().isEmpty()) {

            List<FarmerDTO> farmerDTOList = user.getFarmers().stream().map(farmer -> {

                FarmerDTO farmerDTO = new FarmerDTO();
                farmerDTO.setId(farmer.getId());
                farmerDTO.setUserId(user.getId());
                farmerDTO.setFarmName(farmer.getFarmName());
                farmerDTO.setFarmSize(farmer.getFarmSize());

                farmerDTO.setVillage(
                        farmer.getVillage() != null ? farmer.getVillage() : "N/A"
                );

                if (farmer.getSupervisor() != null) {

                    farmerDTO.setSupervisorId(farmer.getSupervisor().getId());

                    farmerDTO.setSupervisorName(
                            farmer.getSupervisor().getName() != null
                                    ? farmer.getSupervisor().getName()
                                    : "N/A"
                    );

                    // ✅ ADDED THIS (IMPORTANT FIX)
                    farmerDTO.setSupervisorPhone(
                            farmer.getSupervisor().getPhone() != null
                                    ? farmer.getSupervisor().getPhone()
                                    : "N/A"
                    );

                } else {
                    farmerDTO.setSupervisorName("N/A");
                    farmerDTO.setSupervisorPhone("N/A");
                }

                return farmerDTO;

            }).toList();

            dto.setFarmers(farmerDTOList);
        }

        // ================= BUYERS =================
        // 🔥 CHANGED: earlier only first buyer → now handling LIST
        if (user.getBuyers() != null && !user.getBuyers().isEmpty()) {

            List<BuyerDTO> buyerDTOList = user.getBuyers().stream().map(buyer -> {

                BuyerDTO buyerDTO = new BuyerDTO();

                buyerDTO.setCompanyName(
                        buyer.getCompanyName() != null ? buyer.getCompanyName() : "N/A"
                );

                buyerDTO.setAddress(
                        buyer.getAddress() != null ? buyer.getAddress() : "N/A"
                );

                return buyerDTO;

            }).toList();

            // 🔥 CHANGED: set list instead of single buyer
            dto.setBuyers(buyerDTOList);
        }

        return dto;
    }

    // ================= BASIC GET =================
    public UserDTO getUserBasicById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return mapToDTO(user);
    }

    // ================= UPDATE =================
    public UserDTO updateUser(Long id, UserDTO dto) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setName(dto.getName());
        user.setPhone(dto.getPhone());
        user.setRole(dto.getRole());

        if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
        }

        return mapToDTO(userRepository.save(user));
    }

    // ================= DELETE =================
    public void deleteUser(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        userRepository.delete(user);
    }

    // ================= MAPPER =================
    private UserDTO mapToDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole())
                .build();
    }
}