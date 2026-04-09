package com.example.F3M.service;

import com.example.F3M.dto.AdminRegisterDTO;
import com.example.F3M.dto.FarmerDTO;
import com.example.F3M.dto.SupervisorDTO;
import com.example.F3M.model.Farmer;
import com.example.F3M.model.Supervisor;
import com.example.F3M.model.User;
import com.example.F3M.repo.SupervisorRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SupervisorService {

    private static final Logger log = LoggerFactory.getLogger(SupervisorService.class);

    private final SupervisorRepository supervisorRepository;

    public SupervisorService(SupervisorRepository supervisorRepository) {
        this.supervisorRepository = supervisorRepository;
    }
    public void createSupervisor(User user, AdminRegisterDTO dto) {

        // Optional: check already exists
        if (supervisorRepository.findByUser_Id(user.getId()).isPresent()) {
            throw new RuntimeException("Supervisor already exists");
        }

        Supervisor supervisor = Supervisor.builder()
                .name(dto.getName())
                .phone(dto.getPhone())
                .village(dto.getVillage())
                .user(user)
                .build();

        supervisorRepository.save(supervisor);
    }
    // ✅ GET ALL VILLAGES
    public List<String> getAllVillages() {

        log.info("🔥 Fetching villages from DB");

        List<String> villages = supervisorRepository.findDistinctVillages();

        villages.sort(String::compareToIgnoreCase);

        log.info("✅ Villages fetched: {}", villages);

        return villages;
    }

    public String getVillageBySupervisor(Long id) {
        Supervisor supervisor = supervisorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Supervisor not found"));

        return supervisor.getVillage();
    }

    // ✅ CREATE
    public SupervisorDTO createSupervisor(SupervisorDTO dto) {

        Supervisor supervisor = Supervisor.builder()
                .name(dto.getName())
                .phone(dto.getPhone())
                .village(dto.getVillage())
                .build();

        Supervisor saved = supervisorRepository.save(supervisor);

        return mapToDTO(saved);
    }

    // ✅ GET ALL
    public List<SupervisorDTO> getAllSupervisors() {

        return supervisorRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    // ✅ GET BY ID
    public SupervisorDTO getSupervisorById(Long id) {

        Supervisor supervisor = supervisorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Supervisor not found"));

        return mapToDTO(supervisor);
    }

    // ✅ UPDATE
    public SupervisorDTO updateSupervisor(Long id, SupervisorDTO dto) {

        Supervisor supervisor = supervisorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Supervisor not found"));

        supervisor.setName(dto.getName());
        supervisor.setPhone(dto.getPhone());
        supervisor.setVillage(dto.getVillage());

        Supervisor updated = supervisorRepository.save(supervisor);

        return mapToDTO(updated);
    }

    // ✅ DELETE
    public void deleteSupervisor(Long id) {

        Supervisor supervisor = supervisorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Supervisor not found"));

        supervisorRepository.delete(supervisor);
    }

    // ✅ ENTITY → DTO
    private SupervisorDTO mapToDTO(Supervisor supervisor) {

        return SupervisorDTO.builder()
                .id(supervisor.getId())
                .name(supervisor.getName())
                .phone(supervisor.getPhone())
                .village(supervisor.getVillage())
                .farmers(
                        supervisor.getFarmers() == null ? null :
                                supervisor.getFarmers()
                                        .stream()
                                        .map(this::mapFarmerToDTO)
                                        .collect(Collectors.toSet())
                )
                .build();
    }

    // ✅ FARMER MAPPER (FIXED)
    private FarmerDTO mapFarmerToDTO(Farmer farmer) {

        Double latitude = null;
        Double longitude = null;

        if (farmer.getFarmLocation() != null) {
            latitude = farmer.getFarmLocation().getY(); // Y = LAT
            longitude = farmer.getFarmLocation().getX(); // X = LNG
        }

        return FarmerDTO.builder()
                .id(farmer.getId())
                .userId(farmer.getUser() != null ? farmer.getUser().getId() : null)
                .farmName(farmer.getFarmName())
                .farmSize(farmer.getFarmSize())
                .village(farmer.getVillage())
                .latitude(latitude)   // ✅ FIXED
                .longitude(longitude) // ✅ FIXED
                .supervisorId(farmer.getSupervisor() != null ? farmer.getSupervisor().getId() : null)
                .supervisorName(farmer.getSupervisor() != null ? farmer.getSupervisor().getName() : null)
                .productIds(
                        farmer.getProducts() == null ? null :
                                farmer.getProducts()
                                        .stream()
                                        .map(p -> p.getId())
                                        .collect(Collectors.toSet())
                )
                .build();
    }
}