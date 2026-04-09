package com.example.F3M.service;

import com.example.F3M.dto.OrderDTO;
import com.example.F3M.dto.OrderItemDTO;
import com.example.F3M.enums.OrderStatus;
import com.example.F3M.model.*;
import com.example.F3M.repo.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final BuyerRepository buyerRepository;
    private final ProductRepository productRepository;

    public OrderService(OrderRepository orderRepository,
                        BuyerRepository buyerRepository,
                        ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.buyerRepository = buyerRepository;
        this.productRepository = productRepository;
    }

    // ✅ CREATE ORDER (NO STOCK REDUCTION HERE NOW ❗)
    @Transactional
    public OrderDTO createOrder(OrderDTO dto) {

        Buyer buyer = buyerRepository.findById(dto.getBuyerId())
                .orElseThrow(() -> new RuntimeException("Buyer not found"));

        Order order = Order.builder()
                .buyer(buyer)
                .status(OrderStatus.PENDING)
                .totalAmount(dto.getTotalAmount())
                .build();

        List<OrderItem> orderItems = dto.getItems().stream().map(itemDTO -> {

            Product product = productRepository.findById(itemDTO.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            return OrderItem.builder()
                    .product(product)
                    .productName(product.getProductName())
                    .quantity(itemDTO.getQuantity())
                    .price(product.getPricePerKg())
                    .status(OrderStatus.PENDING) // ✅ IMPORTANT
                    .order(order)
                    .build();

        }).toList();

        order.setItems(orderItems);

        Order saved = orderRepository.save(order);

        return mapToDTO(saved);
    }

    // ✅ GET ALL
    public List<OrderDTO> getAllOrders() {
        return orderRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    // ✅ GET BY BUYER
    public List<OrderDTO> getOrdersByBuyer(Long buyerId) {
        return orderRepository.findByBuyerId(buyerId)
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    // ✅ DELETE
    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }

    // ✅ MAPPER
    private OrderDTO mapToDTO(Order order) {

        List<OrderItemDTO> itemDTOs = order.getItems().stream().map(item ->
                OrderItemDTO.builder()
                        .id(item.getId())
                        .productId(item.getProduct().getId())
                        .productName(item.getProductName())
                        .quantity(item.getQuantity())
                        .price(item.getPrice())
                        .status(item.getStatus()) // ✅ ADDED
                        .build()
        ).toList();

        return OrderDTO.builder()
                .id(order.getId())
                .buyerId(order.getBuyer().getId())
                .status(order.getStatus())
                .totalAmount(order.getTotalAmount())
                .items(itemDTOs)
                .build();
    }
}