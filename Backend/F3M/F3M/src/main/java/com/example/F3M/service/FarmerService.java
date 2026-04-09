package com.example.F3M.service;

import com.example.F3M.dto.FarmDTO;
import com.example.F3M.dto.FarmSelectDTO;
import com.example.F3M.dto.FarmerDTO;
import com.example.F3M.enums.RequestStatus;
import com.example.F3M.model.*;
import com.example.F3M.repo.*;

import org.locationtech.jts.geom.*;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class FarmerService {

    private final FarmerRepository farmerRepository;
    private final UserRepository userRepository;
    private final SupervisorRepository supervisorRepository;
    private final ProductRepository productRepository;

    private final GeometryFactory geometryFactory = new GeometryFactory();

    public FarmerService(FarmerRepository farmerRepository,
                         UserRepository userRepository,
                         SupervisorRepository supervisorRepository,
                         ProductRepository productRepository) {

        this.farmerRepository = farmerRepository;
        this.userRepository = userRepository;
        this.supervisorRepository = supervisorRepository;
        this.productRepository = productRepository;
    }

    // ================= CREATE FARMER =================
    public FarmerDTO createFarmer(FarmerDTO dto) {

        if (dto.getUserId() == null) {
            throw new RuntimeException("User ID is required");
        }

        if (dto.getVillage() == null || dto.getVillage().isBlank()) {
            throw new RuntimeException("Village is required");
        }

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Supervisor> supervisors =
                supervisorRepository.findLeastLoadedByVillage(dto.getVillage());

        if (supervisors.isEmpty()) {
            supervisors = supervisorRepository.findLeastLoadedOverall();
        }

        if (supervisors.isEmpty()) {
            throw new RuntimeException("No supervisors available");
        }

        Supervisor selectedSupervisor = supervisors.get(0);

        Point location = null;
        if (dto.getLatitude() != null && dto.getLongitude() != null) {
            location = geometryFactory.createPoint(
                    new Coordinate(dto.getLongitude(), dto.getLatitude())
            );
            location.setSRID(4326);
        }

        Farmer farmer = Farmer.builder()
                .user(user)
                .farmName(dto.getFarmName())
                .farmSize(dto.getFarmSize())
                .village(dto.getVillage())
                .farmLocation(location)
                .supervisor(selectedSupervisor)
                .build();

        return mapToDTO(farmerRepository.save(farmer));
    }

    // ================= GET BY USER =================
    public List<FarmerDTO> getFarmersByUserId(Long userId) {
        return farmerRepository.findByUser_Id(userId)
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    // ================= UPDATE =================
    public FarmerDTO updateFarmer(Long id, FarmerDTO dto) {

        Farmer farmer = farmerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Farmer not found"));

        if (dto.getVillage() == null || dto.getVillage().isBlank()) {
            throw new RuntimeException("Village is required");
        }

        farmer.setFarmName(dto.getFarmName());
        farmer.setFarmSize(dto.getFarmSize());
        farmer.setVillage(dto.getVillage());

        if (dto.getLatitude() != null && dto.getLongitude() != null) {
            Point location = geometryFactory.createPoint(
                    new Coordinate(dto.getLongitude(), dto.getLatitude())
            );
            farmer.setFarmLocation(location);
        }

        List<Supervisor> supervisors =
                supervisorRepository.findLeastLoadedByVillage(dto.getVillage());

        if (supervisors.isEmpty()) {
            supervisors = supervisorRepository.findLeastLoadedOverall();
        }

        if (supervisors.isEmpty()) {
            throw new RuntimeException("No supervisors available");
        }

        farmer.setSupervisor(supervisors.get(0));

        return mapToDTO(farmerRepository.save(farmer));
    }

    // ================= GET ALL =================
    public List<FarmerDTO> getAllFarmers() {
        return farmerRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    public FarmerDTO getFarmerById(Long id) {
        return mapToDTO(
                farmerRepository.findById(id)
                        .orElseThrow(() -> new RuntimeException("Farmer not found"))
        );
    }

    // ================= MY FARMS =================
    public List<FarmDTO> getMyFarm(Long userId) {

        List<Farmer> farmers = farmerRepository
                .findByUser_IdAndStatus(userId, RequestStatus.APPROVED); // ✅ FIX

        if (farmers.isEmpty()) {
            throw new RuntimeException("No approved farms found");
        }

        return farmers.stream()
                .map(farmer -> {

                    Double lat = null;
                    Double lng = null;

                    if (farmer.getFarmLocation() != null) {
                        lat = farmer.getFarmLocation().getY();
                        lng = farmer.getFarmLocation().getX();
                    }

                    return FarmDTO.builder()
                            .id(farmer.getId())
                            .name(farmer.getFarmName())
                            .latitude(lat)
                            .longitude(lng)
                            .build();
                })
                .toList();
    }

    // ================= DELETE (FIXED ✅) =================
    public void deleteFarmer(Long id) {

        Farmer farmer = farmerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Farmer not found"));

        // ✅ DELETE ALL PRODUCTS FIRST (IMPORTANT)
        List<Product> products = productRepository.findByFarmerId(id);
        productRepository.deleteAll(products);

        // ✅ THEN DELETE FARMER
        farmerRepository.delete(farmer);
    }

    // ================= GET FARMER PRODUCT IDS =================
    public Set<Long> getFarmerProducts(Long farmerId) {

        List<Product> products = productRepository.findByFarmerId(farmerId);

        return products.stream()
                .map(Product::getId)
                .collect(Collectors.toSet());
    }
    public List<FarmerDTO> getFarmersByStatus(RequestStatus status) {
        return farmerRepository.findByStatus(status)
                .stream()
                .map(this::mapToDTO)
                .toList();
    }
    public List<FarmerDTO> getPendingFarmersBySupervisor(Long userId) {

        Supervisor supervisor = supervisorRepository.findByUser_Id(userId)
                .orElseThrow(() -> new RuntimeException("Supervisor not found"));

        return farmerRepository
                .findBySupervisor_IdAndStatus(supervisor.getId(), RequestStatus.PENDING)
                .stream()
                .map(this::mapToDTO)
                .toList();
    }
    public void updateStatus(Long id, RequestStatus status) {
        Farmer farmer = farmerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Farmer not found"));

        farmer.setStatus(status);
        farmerRepository.save(farmer);
    }

    public List<FarmerDTO> getFarmersBySupervisorUserId(Long userId) {

        // 🔥 Step 1: find supervisor using USER ID
        Supervisor supervisor = supervisorRepository.findByUser_Id(userId)
                .orElseThrow(() -> new RuntimeException("Supervisor not found"));

        // 🔥 Step 2: get ONLY APPROVED farmers under this supervisor
        List<Farmer> farmers =
                farmerRepository.findBySupervisor_IdAndStatus(
                        supervisor.getId(),
                        RequestStatus.APPROVED   // ✅ IMPORTANT
                );

        return farmers.stream()
                .map(this::mapToDTO)
                .toList();
    }
    public List<FarmSelectDTO> getAllFarmsForAdmin() {

        return farmerRepository
                .findByStatus(RequestStatus.APPROVED) // ✅ FIX
                .stream()
                .map(farmer -> FarmSelectDTO.builder()
                        .id(farmer.getId())
                        .farmName(farmer.getFarmName())
                        .build()
                )
                .toList();
    }
    // ================= DTO =================
    // ================= DTO MAPPING =================
    private FarmerDTO mapToDTO(Farmer farmer) {

        // ✅ Location handling
        Double lat = null;
        Double lng = null;

        if (farmer.getFarmLocation() != null) {
            lat = farmer.getFarmLocation().getY(); // latitude
            lng = farmer.getFarmLocation().getX(); // longitude
        }

        // ✅ Fetch product IDs
        List<Product> products = productRepository.findByFarmerId(farmer.getId());

        Set<Long> productIds = products.stream()
                .map(Product::getId)
                .collect(Collectors.toSet());

        // ✅ Build DTO safely
        return FarmerDTO.builder()
                // ===== FARMER =====
                .id(farmer.getId())
                .farmName(farmer.getFarmName())
                .farmSize(farmer.getFarmSize())
                .village(farmer.getVillage())
                .status(farmer.getStatus())

                // ===== LOCATION =====
                .latitude(lat)
                .longitude(lng)

                // ===== USER DETAILS (IMPORTANT FOR UI) =====
                .userId(
                        farmer.getUser() != null
                                ? farmer.getUser().getId()
                                : null
                )
                .userName(
                        farmer.getUser() != null
                                ? farmer.getUser().getName()
                                : null
                )
                .email(
                        farmer.getUser() != null
                                ? farmer.getUser().getEmail()
                                : null
                )
                .phone(
                        farmer.getUser() != null
                                ? farmer.getUser().getPhone()
                                : null
                )

                // ===== SUPERVISOR DETAILS =====
                .supervisorId(
                        farmer.getSupervisor() != null
                                ? farmer.getSupervisor().getId()
                                : null
                )
                .supervisorName(
                        farmer.getSupervisor() != null
                                ? farmer.getSupervisor().getName()
                                : null
                )

                // ===== PRODUCTS =====
                .productIds(productIds)

                .build();
    }
}