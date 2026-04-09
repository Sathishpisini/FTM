package com.example.F3M.dto;

import com.example.F3M.enums.OrderStatus;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemDTO {

    private Long id;

    private Long orderId;
    private Long productId;

    private String productName;
    private Integer quantity;
    private Double price;
    private String farmName;
    private OrderStatus status;

}