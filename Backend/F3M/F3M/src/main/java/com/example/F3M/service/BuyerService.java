package com.example.F3M.service;

import com.example.F3M.dto.BuyerDTO;
import com.example.F3M.dto.BuyerDetailsDTO;
import com.example.F3M.enums.RequestStatus;
import com.example.F3M.exception.ResourceNotFoundException;
import com.example.F3M.model.Buyer;
import com.example.F3M.model.Company;
import com.example.F3M.model.User;
import com.example.F3M.repo.BuyerRepository;
import com.example.F3M.repo.CompanyRepository;  // Make sure you have this repository
import com.example.F3M.repo.UserRepository;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import org.locationtech.jts.geom.PrecisionModel;
import org.springframework.web.server.ResponseStatusException;


@Service
public class BuyerService {

    private final BuyerRepository buyerRepository;
    private final CompanyRepository companyRepository; // Make sure this repository exists
    private final UserRepository userRepository;
    private final GeometryFactory geometryFactory =
            new GeometryFactory(new PrecisionModel(), 4326);

    public BuyerService(BuyerRepository buyerRepository, CompanyRepository companyRepository, UserRepository userRepository) {
        this.buyerRepository = buyerRepository;
        this.companyRepository = companyRepository;
        this.userRepository = userRepository;
    }

    // ✅ CREATE GS
    public BuyerDTO createBuyer(BuyerDTO dto) {

        // ✅ get user
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // ✅ location (optional)
        Point location = null;
        if (dto.getLatitude() != null && dto.getLongitude() != null) {
            location = geometryFactory.createPoint(
                    new Coordinate(dto.getLongitude(), dto.getLatitude())
            );
        }

        // ✅ create buyer
        Buyer buyer = Buyer.builder()
                .user(user)
                .companyName(dto.getCompanyName())
                .address(dto.getAddress())
                .location(location)
                .build();

        Buyer savedBuyer = buyerRepository.save(buyer);

        return mapToDTO(savedBuyer);
    }
    public List<BuyerDTO> getBuyersByStatus(RequestStatus status) {
        return buyerRepository.findByStatus(status)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
    public List<BuyerDTO> getApprovedAndPendingBuyers() {
        List<RequestStatus> statuses = List.of(
                RequestStatus.APPROVED,
                RequestStatus.PENDING
        );

        return buyerRepository.findByStatusIn(statuses)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public BuyerDTO updateBuyerStatus(Long buyerId, RequestStatus status) {

        Buyer buyer = buyerRepository.findById(buyerId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Buyer not found"
                ));

        buyer.setStatus(status);

        Buyer updatedBuyer = buyerRepository.save(buyer);

        return mapToDTO(updatedBuyer);
    }
    public List<BuyerDetailsDTO> getBuyerDetailsByUserId(Long userId) {

        List<Buyer> buyers = buyerRepository.findByUser_Id(userId);

        if (buyers.isEmpty()) {
            throw new RuntimeException("No buyers found for userId: " + userId);
        }

        return buyers.stream()
                .map(this::mapToDetailsDTO)
                .collect(Collectors.toList());
    }

    // ✅ GET COMPANIES BY USER ID
    public List<Company> getCompaniesByUserId(Long userId) {
        // Fetch the buyer by userId
        Buyer buyer = buyerRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Buyer", "userId", userId));

        // Fetch all companies associated with this buyer
        return companyRepository.findByBuyer(buyer);  // Make sure you have this method in the repository
    }
    public List<BuyerDTO> getApprovedBuyersByUser(Long userId) {

        List<Buyer> buyers = buyerRepository
                .findByUser_IdAndStatus(userId, RequestStatus.APPROVED);

        return buyers.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // ✅ GET ALL
    public List<BuyerDTO> getAllBuyers() {

            List<Buyer> buyers = buyerRepository.findAll();
            return buyers.stream()
                    .map(this::mapToDTO)
                    .collect(Collectors.toList());

    }



    // ✅ GET BUYER BY USER ID
    public Buyer getBuyerByUserId(Long userId) {

        List<Buyer> buyers = buyerRepository.findByUser_Id(userId);

        if (buyers == null || buyers.isEmpty()) {
            throw new RuntimeException("Buyer not found");
        }

        return buyers.get(0); // ✅ FIX: return first
    }

    // ✅ GET BUYER ID BY USER ID
    public Long getBuyerIdByUserId(Long userId) {
        List<Buyer> buyers = buyerRepository.findByUser_Id(userId);

        if (buyers.isEmpty()) {
            throw new RuntimeException("Buyer not found");
        }

        return buyers.get(0).getId(); // avoid duplicate crash
    }

    // ✅ GET BY ID
    public BuyerDTO getBuyerById(Long id) {
        Buyer buyer = buyerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Buyer not found"));

        return mapToDTO(buyer);
    }

    // ✅ UPDATE
    public BuyerDTO updateBuyer(Long id, BuyerDTO dto) {

        Buyer buyer = buyerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Buyer not found"));

        buyer.setCompanyName(dto.getCompanyName());
        buyer.setAddress(dto.getAddress());

        if (dto.getUserId() != null) {
            User user = userRepository.findById(dto.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            buyer.setUser(user);
        }

        // Update location if provided
        if (dto.getLatitude() != null && dto.getLongitude() != null) {
            Point location = geometryFactory.createPoint(new Coordinate(dto.getLongitude(), dto.getLatitude()));
            buyer.setLocation(location);
        }

        Buyer updated = buyerRepository.save(buyer);
        return mapToDTO(updated);
    }

    // ✅ DELETE
    public void deleteBuyer(Long id) {
        Buyer buyer = buyerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Buyer not found"));
        buyerRepository.delete(buyer);
    }
    private BuyerDetailsDTO mapToDetailsDTO(Buyer buyer) {

        Double latitude = null;
        Double longitude = null;

        if (buyer.getLocation() != null) {
            latitude = buyer.getLocation().getY();
            longitude = buyer.getLocation().getX();
        }

        return BuyerDetailsDTO.builder()
                .userId(buyer.getUser().getId())
                .name(buyer.getUser().getName())
                .email(buyer.getUser().getEmail())
                .phone(buyer.getUser().getPhone())
                .role(buyer.getUser().getRole())

                .buyerId(buyer.getId())
                .companyName(buyer.getCompanyName())
                .address(buyer.getAddress())
                .latitude(latitude)
                .longitude(longitude)
                .build();
    }
    // ✅ MAPPER
    private BuyerDTO mapToDTO(Buyer buyer) {

        Double latitude = null;
        Double longitude = null;

        if (buyer.getLocation() != null) {
            latitude = buyer.getLocation().getY();   // Y = latitude
            longitude = buyer.getLocation().getX();  // X = longitude
        }

        return BuyerDTO.builder()
                .id(buyer.getId())
                .userId(buyer.getUser() != null ? buyer.getUser().getId() : null)
                .companyName(buyer.getCompanyName())
                .address(buyer.getAddress())
                .latitude(latitude)
                .longitude(longitude)
                .build();
    }
}