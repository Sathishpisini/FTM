package com.example.F3M.dto;

import com.example.F3M.enums.OrderStatus;
import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDTO {

    private Long id;
    private OrderStatus status;   // ✅ Enum type
    private Double totalAmount;
    private Long buyerId;         // Reference to Buyer
    private List<OrderItemDTO> items;
}