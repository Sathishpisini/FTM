package com.example.F3M.service;

import com.example.F3M.config.JwtUtil;
import com.example.F3M.dto.ProductDTO;
import com.example.F3M.enums.ProductStatus;
import com.example.F3M.model.Farmer;
import com.example.F3M.model.Product;
import com.example.F3M.repo.FarmerRepository;
import com.example.F3M.repo.ProductRepository;
import org.locationtech.jts.geom.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final FarmerRepository farmerRepository;
    private final FileStorageService fileStorageService;
    private final JwtUtil jwtUtil;
    private final GeometryFactory geometryFactory = new GeometryFactory();

    public ProductService(ProductRepository productRepository,
                          FarmerRepository farmerRepository,
                          FileStorageService fileStorageService,
                          JwtUtil jwtUtil) {
        this.productRepository = productRepository;
        this.farmerRepository = farmerRepository;
        this.fileStorageService = fileStorageService;
        this.jwtUtil = jwtUtil;
    }

    // ================= SAFE ENUM PARSER =================
    private ProductStatus parseStatus(String status) {
        try {
            return status != null ? ProductStatus.valueOf(status.toUpperCase()) : ProductStatus.PENDING;
        } catch (Exception e) {
            return ProductStatus.PENDING;
        }
    }

    // ================= CREATE =================
    public void addProduct(Long userId, String role, Long farmerId,
                           String productName, String productCategory, String description,
                           Double pricePerKg, Double quantityAvailable, String unit,
                           String variety, Boolean organic, Boolean seasonal,
                           String status, MultipartFile image) {

        Farmer farmer = farmerRepository.findById(farmerId)
                .orElseThrow(() -> new RuntimeException("Farm not found"));

        if (!"ADMIN".equalsIgnoreCase(role)) {
            if (!farmer.getUser().getId().equals(userId)) {
                throw new RuntimeException("Unauthorized access to this farm");
            }
        }

        String imageUrl = fileStorageService.storeFile(image);

        Product product = Product.builder()
                .productName(productName)
                .productCategory(productCategory)
                .description(description)
                .pricePerKg(pricePerKg)
                .quantityAvailable(quantityAvailable)
                .unit(unit)
                .variety(variety)
                .organic(organic)
                .seasonal(seasonal)
                .imageUrl(imageUrl)
                .status(parseStatus(status))
                .location(farmer.getFarmLocation())
                .farmer(farmer)
                .build();

        productRepository.save(product);
    }

    // ================= GET ALL (ONLY APPROVED) =================
    public List<ProductDTO> getAllProducts() {
        return productRepository.findByStatus(ProductStatus.APPROVED)
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    // ================= FRESH (ONLY APPROVED) =================
    public List<ProductDTO> getFreshProducts() {

        LocalDateTime twoDaysAgo = LocalDateTime.now().minusDays(2);

        return productRepository
                .findByStatusAndCreatedAtAfter(ProductStatus.APPROVED, twoDaysAgo)
                .stream()
                .map(this::mapToDTO)
                .toList();
    }
    // ✅ Organic Approved Products
    public List<ProductDTO> getOrganicProducts() {
        return productRepository
                .findByOrganicTrueAndStatus(ProductStatus.APPROVED)
                .stream()
                .map(this::mapToDTO)
                .toList();
    }
    // ================= MY PRODUCTS (ONLY APPROVED) =================
    public List<ProductDTO> getFarmerProductsByEmail(String email) {

        List<Farmer> farmers = farmerRepository.findByUser_Email(email);

        if (farmers.isEmpty()) {
            throw new RuntimeException("No farmers found for user");
        }

        Map<Long, String> farmerMap = farmers.stream()
                .collect(Collectors.toMap(Farmer::getId, Farmer::getFarmName));

        List<Long> farmerIds = farmers.stream()
                .map(Farmer::getId)
                .toList();

        return productRepository.findByFarmerIdInAndStatus(
                        farmerIds, ProductStatus.APPROVED)
                .stream()
                .map(product -> ProductDTO.builder()
                        .id(product.getId())
                        .productName(product.getProductName())
                        .imageUrl(product.getImageUrl())
                        .pricePerKg(product.getPricePerKg())
                        .quantityAvailable(product.getQuantityAvailable())
                        .farmName(product.getFarmer() != null
                                ? farmerMap.get(product.getFarmer().getId())
                                : null)
                        .build())
                .toList();
    }
    // ================= 🔥 PENDING (FARMER REQUEST LIST) =================
    public List<ProductDTO> getPendingProductsForFarmer(String email) {

        List<Farmer> farmers = farmerRepository.findByUser_Email(email);

        List<Long> farmerIds = farmers.stream().map(Farmer::getId).toList();

        return productRepository.findByFarmerIdInAndStatus(
                        farmerIds, ProductStatus.PENDING)
                .stream()
                .map(this::mapToDTO)
                .toList();
    }
    public ProductDTO getProductById(Long id) {

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        return mapToDTO(product);
    }
    // ================= 🔥 ADMIN - ALL PENDING =================
    public List<ProductDTO> getAllPendingProducts() {
        return productRepository.findByStatus(ProductStatus.PENDING)
                .stream()
                .map(this::mapToDTO)
                .toList();
    }
    // ================= UPDATE PRODUCT STATUS =================
    public ProductDTO updateProductStatus(Long productId, ProductStatus status) {

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        product.setStatus(status);

        Product updated = productRepository.save(product);

        return mapToDTO(updated);
    }
    // ================= UPDATE =================
    public ProductDTO updateProductPartial(Long id, ProductDTO dto) {

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (dto.getProductName() != null) product.setProductName(dto.getProductName());
        if (dto.getProductCategory() != null) product.setProductCategory(dto.getProductCategory());
        if (dto.getDescription() != null) product.setDescription(dto.getDescription());
        if (dto.getPricePerKg() != null) product.setPricePerKg(dto.getPricePerKg());
        if (dto.getQuantityAvailable() != null) product.setQuantityAvailable(dto.getQuantityAvailable());
        if (dto.getUnit() != null) product.setUnit(dto.getUnit());
        if (dto.getImageUrl() != null) product.setImageUrl(dto.getImageUrl());
        if (dto.getVariety() != null) product.setVariety(dto.getVariety());



        if (dto.getOrganic() != null) product.setOrganic(dto.getOrganic());
        if (dto.getSeasonal() != null) product.setSeasonal(dto.getSeasonal());

        Product saved = productRepository.save(product);
        return mapToDTO(saved);
    }
    // ================= SUPERVISOR - PENDING PRODUCTS =================
    public List<ProductDTO> getPendingProductsForSupervisor(String email) {

        // 1. Get farmers under supervisor
        List<Farmer> farmers = farmerRepository.findBySupervisor_User_Email(email);

        if (farmers.isEmpty()) {
            throw new RuntimeException("No farmers found under this supervisor");
        }

        // 2. Extract farmer IDs
        List<Long> farmerIds = farmers.stream()
                .map(Farmer::getId)
                .toList();

        // 3. Fetch PENDING products
        return productRepository.findByFarmerIdInAndStatus(
                        farmerIds, ProductStatus.PENDING)
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    // ================= DELETE =================
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
    public List<ProductDTO> getSeasonalProducts() {
        return productRepository
                .findBySeasonalTrueAndStatus(ProductStatus.APPROVED) // ✅ DB filter
                .stream()
                .map(this::mapToDTO)
                .toList();
    }
    // ================= MAPPER =================
    private ProductDTO mapToDTO(Product product) {

        Double lat = null;
        Double lng = null;

        if (product.getLocation() != null) {
            lat = product.getLocation().getY();
            lng = product.getLocation().getX();
        }
        String supervisorName = null;
        String supervisorPhone = null;

        if (product.getFarmer() != null &&
                product.getFarmer().getSupervisor() != null &&
                product.getFarmer().getSupervisor().getUser() != null) {

            supervisorName = product.getFarmer().getSupervisor().getUser().getName();
            supervisorPhone = product.getFarmer().getSupervisor().getUser().getPhone();
        }

        return ProductDTO.builder()
                .id(product.getId())
                .productName(product.getProductName())
                .productCategory(product.getProductCategory())
                .description(product.getDescription())
                .pricePerKg(product.getPricePerKg())
                .quantityAvailable(product.getQuantityAvailable())
                .unit(product.getUnit())
                .imageUrl(product.getImageUrl())
                .variety(product.getVariety())
                .status(product.getStatus().name())
                .organic(product.isOrganic())
                .seasonal(product.isSeasonal())
                .farmerId(product.getFarmer() != null ? product.getFarmer().getId() : null)
                .latitude(lat)
                .longitude(lng)
                .supervisorName(supervisorName)
                .supervisorPhone(supervisorPhone)
                .createdAt(product.getCreatedAt())
                .build();
    }
}