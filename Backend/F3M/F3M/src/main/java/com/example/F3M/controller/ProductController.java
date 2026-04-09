package com.example.F3M.controller;

import com.example.F3M.dto.ProductDTO;

import com.example.F3M.enums.ProductStatus;
import com.example.F3M.model.Product;
import com.example.F3M.config.JwtUtil;
import com.example.F3M.service.ProductService;
import com.example.F3M.service.JwtService;
import com.example.F3M.service.FileStorageService;

import jakarta.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.servlet.http.HttpServletRequest;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    @Value("${spring.servlet.multipart.max-file-size}")
    private String maxFileSize;

    @PostConstruct
    public void init() {
        System.out.println("Max file size: " + maxFileSize);
    }
    private final ProductService productService;
    private final JwtService jwtService;
    private final FileStorageService fileStorageService;
    private final JwtUtil jwtUtil;

    public ProductController(ProductService productService,
                             JwtService jwtService,
                             FileStorageService fileStorageService,JwtUtil jwtUtil) {

        this.productService = productService;
        this.jwtService = jwtService;
        this.fileStorageService = fileStorageService;
        this.jwtUtil = jwtUtil;
    }


    // ================= ADD PRODUCT =================
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> addProduct(

            @RequestParam String productName,
            @RequestParam String productCategory,
            @RequestParam String description,
            @RequestParam Double pricePerKg,
            @RequestParam Double quantityAvailable,
            @RequestParam String unit,
            @RequestParam String variety,

            @RequestParam Boolean organic,
            @RequestParam Boolean seasonal,
            @RequestParam String status,

            @RequestParam Long farmerId,

            // ✅ Must match frontend key "image"
            @RequestParam("image") MultipartFile image,

            @RequestHeader("Authorization") String token
    ) {

        // Remove Bearer prefix
        token = token.replace("Bearer ", "");
        String role = jwtUtil.extractRole(token);
        // Extract userId from JWT
        Long userId = jwtUtil.extractUserId(token);

        // Call service
        productService.addProduct(
                userId,
                role,
                farmerId,
                productName,
                productCategory,
                description,
                pricePerKg,
                quantityAvailable,
                unit,
                variety,
                organic,
                seasonal,
                status,
                image
        );

        return ResponseEntity.ok("Product added");
    }
    // ================= GET ALL =================
    @GetMapping
    public ResponseEntity<List<ProductDTO>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    // ================= GET FRESH =================
    @GetMapping("/fresh")
    public ResponseEntity<List<ProductDTO>> getFreshProducts() {
        return ResponseEntity.ok(productService.getFreshProducts());
    }
    @GetMapping("/organic")
    public List<ProductDTO> getOrganicProducts() {
        return productService.getOrganicProducts();
    }
    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(
                productService.getProductById(id)
        );
    }

    // ================= GET MY PRODUCTS =================
    @GetMapping("/farmer-products")
    public ResponseEntity<List<ProductDTO>> getFarmerProducts(
            @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.replace("Bearer ", "");
        String email = jwtService.extractUsername(token);

        return ResponseEntity.ok(
                productService.getFarmerProductsByEmail(email)
        );
    }
    // ================= 🔥 FARMER PENDING REQUEST LIST =================
    @GetMapping("/pending/my")
    public ResponseEntity<List<ProductDTO>> getMyPendingProducts(
            @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.replace("Bearer ", "");
        String email = jwtService.extractUsername(token);

        return ResponseEntity.ok(
                productService.getPendingProductsForFarmer(email)
        );
    }

    // ================= 🔥 ADMIN ALL PENDING =================
    @GetMapping("/pending/all")
    public ResponseEntity<List<ProductDTO>> getAllPendingProducts() {
        return ResponseEntity.ok(
                productService.getAllPendingProducts()
        );
    }
    // ================= UPDATE PRODUCT STATUS (ADMIN ONLY) =================
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateProductStatus(
            @PathVariable Long id,
            @RequestParam String status,
            @RequestHeader("Authorization") String token
    ) {
        token = token.replace("Bearer ", "");

        String role = jwtUtil.extractRole(token);

        // ✅ SECURITY CHECK
        if (!"ADMIN".equalsIgnoreCase(role) &&
                !"SUPERVISOR".equalsIgnoreCase(role) ) {
            return ResponseEntity.status(403).body("Only ADMIN can update status");
        }

        try {
            ProductStatus productStatus = ProductStatus.valueOf(status.toUpperCase());

            return ResponseEntity.ok(
                    productService.updateProductStatus(id, productStatus)
            );

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid status value");
        }
    }
    // ================= UPDATE =================
    @PatchMapping("/{id}")
    public ResponseEntity<?> partialUpdateProduct(
            @PathVariable Long id,
            @RequestBody ProductDTO dto
    ) {
        try {
            ProductDTO updatedProduct = productService.updateProductPartial(id, dto);
            return ResponseEntity.ok(updatedProduct);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // ================= SUPERVISOR - PENDING PRODUCTS =================
    @GetMapping("/supervisor/pending")
    public ResponseEntity<List<ProductDTO>> getSupervisorPendingProducts(
            @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.replace("Bearer ", "");

        // ✅ ADD HERE
        String role = jwtUtil.extractRole(token);
        if (!"SUPERVISOR".equalsIgnoreCase(role)) {
            return ResponseEntity.status(403).build();
        }

        String email = jwtService.extractUsername(token);

        return ResponseEntity.ok(
                productService.getPendingProductsForSupervisor(email)
        );
    }
    // ================= DELETE =================
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok("Product deleted successfully");
    }
    @GetMapping("/seasonal")
    public ResponseEntity<List<ProductDTO>> getSeasonalProducts() {
        return ResponseEntity.ok(productService.getSeasonalProducts());
    }
    // ================= TEST =================
    @GetMapping("/test")
    public String test() {
        return "PRODUCT WORKING";
    }
}