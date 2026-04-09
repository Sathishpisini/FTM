package com.example.F3M.controller;

import com.example.F3M.dto.OrderDTO;
import com.example.F3M.service.OrderService;
import com.example.F3M.service.BuyerService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;
    private final BuyerService buyerService;

    public OrderController(OrderService orderService,
                           BuyerService buyerService) {
        this.orderService = orderService;
        this.buyerService = buyerService;
    }

    // ✅ CREATE ORDER
    @PostMapping
    public ResponseEntity<OrderDTO> createOrder(@RequestBody OrderDTO orderDTO) {
        return ResponseEntity.ok(orderService.createOrder(orderDTO));
    }

    // ✅ GET ALL ORDERS
    @GetMapping
    public ResponseEntity<List<OrderDTO>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    // ✅ GET BUYER ORDERS
    @GetMapping("/buyer/{buyerId}")
    public ResponseEntity<List<OrderDTO>> getBuyerOrders(@PathVariable Long buyerId) {
        return ResponseEntity.ok(orderService.getOrdersByBuyer(buyerId));
    }

    // ✅ GET BUYER ID FROM USER
    @GetMapping("/buyers/by-user/{userId}")
    public ResponseEntity<Long> getBuyerIdByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(buyerService.getBuyerIdByUserId(userId));
    }

    // ✅ DELETE ORDER
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
        return ResponseEntity.ok("Order deleted");
    }
}