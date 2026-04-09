package com.example.F3M.controller;

import com.example.F3M.dto.OrderItemDTO;
import com.example.F3M.service.OrderItemService;
import com.example.F3M.service.JwtService;
import com.example.F3M.config.JwtUtil;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/order-items")
public class OrderItemController {

    private final OrderItemService orderItemService;
    private final JwtService jwtService;
    private final JwtUtil jwtUtil;

    public OrderItemController(OrderItemService orderItemService,
                               JwtService jwtService,
                               JwtUtil jwtUtil) {
        this.orderItemService = orderItemService;
        this.jwtService = jwtService;
        this.jwtUtil = jwtUtil;
    }

    // ✅ CREATE
    @PostMapping
    public ResponseEntity<OrderItemDTO> addItem(@RequestBody OrderItemDTO dto) {
        return ResponseEntity.ok(orderItemService.addOrderItem(dto));
    }

    // ✅ GET ALL
    @GetMapping
    public ResponseEntity<List<OrderItemDTO>> getAllItems() {
        return ResponseEntity.ok(orderItemService.getAllItems());
    }

    // ✅ GET BY ORDER
    @GetMapping("/order/{orderId}")
    public ResponseEntity<List<OrderItemDTO>> getItems(@PathVariable Long orderId) {
        return ResponseEntity.ok(orderItemService.getOrderItems(orderId));
    }

    // ❌ REMOVE UPDATE (not needed usually)
    // If you want, you can keep it — but not required for your flow

    // ✅ DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteItem(@PathVariable Long id) {
        orderItemService.deleteOrderItem(id);
        return ResponseEntity.ok("Order item deleted successfully");
    }

    // =====================================================
    // 🔥 SUPERVISOR APIs (MOST IMPORTANT)
    // =====================================================

    // ✅ GET PENDING ITEMS FOR SUPERVISOR
    @GetMapping("/supervisor/pending-items")
    public ResponseEntity<?> getPendingItems(
            @RequestHeader(value = "Authorization", required = false) String token) {

        System.out.println("TOKEN RECEIVED: " + token);

        if (token == null) {
            return ResponseEntity.badRequest().body("Missing token");
        }

        token = token.replace("Bearer ", "");

        try {
            String role = jwtUtil.extractRole(token);
            System.out.println("ROLE: " + role);

            String email = jwtService.extractUsername(token);
            System.out.println("EMAIL: " + email);

            return ResponseEntity.ok(
                    orderItemService.getPendingItemsForSupervisor(email)
            );

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("JWT ERROR: " + e.getMessage());
        }
    }
    @GetMapping("/admin/pending-items")
    public ResponseEntity<?> getAllPendingItems(
            @RequestHeader("Authorization") String token) {

        token = token.replace("Bearer ", "");

        String role = jwtUtil.extractRole(token);

        // 🔐 ONLY ADMIN CAN ACCESS
        if (!"ADMIN".equalsIgnoreCase(role)) {
            return ResponseEntity.status(403).body("Access Denied");
        }

        return ResponseEntity.ok(
                orderItemService.getAllPendingItems()
        );
    }

    // ✅ APPROVE ITEM
    @PatchMapping("/{itemId}/approve")
    public ResponseEntity<?> approveItem(
            @PathVariable Long itemId,
            @RequestHeader("Authorization") String token) {

        token = token.replace("Bearer ", "");

        String role = jwtUtil.extractRole(token);
        if (!"SUPERVISOR".equalsIgnoreCase(role)) {
            return ResponseEntity.status(403).body("Access Denied");
        }

        String email = jwtService.extractUsername(token);

        return ResponseEntity.ok(
                orderItemService.approveOrderItem(itemId, email)
        );
    }
    // ✅ REJECT ITEM (🔥 NEW)
    @PatchMapping("/{itemId}/reject")
    public ResponseEntity<?> rejectItem(
            @PathVariable Long itemId,
            @RequestHeader("Authorization") String token) {

        token = token.replace("Bearer ", "");

        String role = jwtUtil.extractRole(token);
        if (!"SUPERVISOR".equalsIgnoreCase(role)) {
            return ResponseEntity.status(403).body("Access Denied");
        }

        String email = jwtService.extractUsername(token);

        return ResponseEntity.ok(
                orderItemService.rejectOrderItem(itemId, email)
        );
    }

    // =====================================================
// 🔥 ORDERED ITEMS APIs
// =====================================================

    // ✅ GET ORDERED ITEMS (ROLE BASED)
    @GetMapping("/ordered-items")
    public ResponseEntity<?> getOrderedItems(
            @RequestHeader("Authorization") String token) {

        token = token.replace("Bearer ", "");

        String role = jwtUtil.extractRole(token);
        String email = jwtService.extractUsername(token);

        if ("ADMIN".equalsIgnoreCase(role)) {
            return ResponseEntity.ok(
                    orderItemService.getAllOrderedItems()
            );
        } else if ("SUPERVISOR".equalsIgnoreCase(role)) {
            return ResponseEntity.ok(
                    orderItemService.getOrderedItemsForSupervisor(email)
            );
        } else {
            return ResponseEntity.status(403).body("Access Denied");
        }
    }

// =====================================================

    // ✅ COMPLETE ORDER ITEM
    @PatchMapping("/{itemId}/complete")
    public ResponseEntity<?> completeItem(
            @PathVariable Long itemId,
            @RequestHeader("Authorization") String token) {

        token = token.replace("Bearer ", "");

        String role = jwtUtil.extractRole(token);
        String email = jwtService.extractUsername(token);

        return ResponseEntity.ok(
                orderItemService.completeOrderItem(itemId, email, role)
        );
    }

// =====================================================

    // ✅ CANCEL ORDER ITEM
    @PatchMapping("/{itemId}/cancel")
    public ResponseEntity<?> cancelItem(
            @PathVariable Long itemId,
            @RequestHeader("Authorization") String token) {

        token = token.replace("Bearer ", "");

        String role = jwtUtil.extractRole(token);
        String email = jwtService.extractUsername(token);

        return ResponseEntity.ok(
                orderItemService.cancelOrderItem(itemId, email, role)
        );
    }
// =====================================================
// 🔥 GET COMPLETED ITEMS (ROLE BASED)
// =====================================================

    @GetMapping("/completed-items")
    @PreAuthorize("hasAnyRole('ADMIN','SUPERVISOR','BUYER','FARMER')")
    public ResponseEntity<?> getCompletedItems(
            @RequestHeader("Authorization") String token) {

        token = token.replace("Bearer ", "");

        String role = jwtUtil.extractRole(token);
        String email = jwtService.extractUsername(token);

        // ✅ Supervisor → only his items
        if ("SUPERVISOR".equalsIgnoreCase(role)) {
            return ResponseEntity.ok(
                    orderItemService.getCompletedItemsForSupervisor(email)
            );
        }

        // ✅ Admin + Others → all items
        return ResponseEntity.ok(
                orderItemService.getAllCompletedItems()
        );
    }
    // =====================================================

    // ✅ TEST
    @GetMapping("/test")
    public String test() {
        return "ORDER ITEM WORKING";
    }
}