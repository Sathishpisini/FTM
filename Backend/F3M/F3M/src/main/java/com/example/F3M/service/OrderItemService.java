package com.example.F3M.service;

import com.example.F3M.dto.OrderItemDTO;
import com.example.F3M.enums.OrderStatus;
import com.example.F3M.model.Order;
import com.example.F3M.model.OrderItem;
import com.example.F3M.model.Product;
import com.example.F3M.repo.OrderItemRepository;
import com.example.F3M.repo.OrderRepository;
import com.example.F3M.repo.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class OrderItemService {

    private final OrderItemRepository orderItemRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public OrderItemService(OrderItemRepository orderItemRepository,
                            OrderRepository orderRepository,
                            ProductRepository productRepository) {
        this.orderItemRepository = orderItemRepository;
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }

    // ✅ CREATE (OLD)
    public OrderItemDTO addOrderItem(OrderItemDTO dto) {

        Order order = orderRepository.findById(dto.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));

        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        OrderItem item = OrderItem.builder()
                .order(order)
                .product(product)
                .quantity(dto.getQuantity())
                .price(product.getPricePerKg())
                .status(OrderStatus.PENDING) // ✅ IMPORTANT
                .build();

        OrderItem saved = orderItemRepository.save(item);

        return mapToDTO(saved);
    }

    // ✅ GET ALL (OLD)
    public List<OrderItemDTO> getAllItems() {
        return orderItemRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    // ✅ GET BY ORDER (OLD)
    public List<OrderItemDTO> getOrderItems(Long orderId) {
        return orderItemRepository.findByOrderId(orderId)
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    // ✅ DELETE (OLD)
    public void deleteOrderItem(Long id) {
        OrderItem item = orderItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order item not found"));
        orderItemRepository.delete(item);
    }

    // =========================================================
    // 🔥 NEW: SUPERVISOR FLOW
    // =========================================================

    // ✅ GET PENDING ITEMS FOR SUPERVISOR
    public List<OrderItemDTO> getPendingItemsForSupervisor(String email) {

        List<OrderItem> items =
                orderItemRepository.findPendingItemsBySupervisor(email);

        return items.stream()
                .map(item -> OrderItemDTO.builder()
                        .id(item.getId())
                        .orderId(item.getOrder().getId())
                        .productId(item.getProduct().getId())
                        .productName(item.getProduct().getProductName())
                        .quantity(item.getQuantity())
                        .price(item.getPrice())
                        .status(item.getStatus())
                        .farmName(item.getProduct().getFarmer().getFarmName())
                        .build())
                .toList();
    }
    public List<OrderItemDTO> getAllPendingItems() {

        List<OrderItem> items =
                orderItemRepository.findByStatus(OrderStatus.PENDING);

        return items.stream()
                .map(item -> OrderItemDTO.builder()
                        .id(item.getId())
                        .orderId(item.getOrder().getId())
                        .productId(item.getProduct().getId())
                        .productName(item.getProduct().getProductName())
                        .quantity(item.getQuantity())
                        .price(item.getPrice())
                        .status(item.getStatus())
                        .farmName(item.getProduct().getFarmer().getFarmName())
                        .build())
                .toList();
    }

    // ✅ APPROVE ITEM + REDUCE STOCK
    @Transactional
    public String approveOrderItem(Long itemId, String supervisorEmail) {

        OrderItem item = orderItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        // 🔐 SECURITY CHECK
        String email =
                item.getProduct()
                        .getFarmer()
                        .getSupervisor()
                        .getUser()
                        .getEmail();

        if (!email.equals(supervisorEmail)) {
            throw new RuntimeException("Not authorized");
        }

        if (item.getStatus() != OrderStatus.PENDING) {
            throw new RuntimeException("Already processed");
        }

        Product product = item.getProduct();

        if (product.getQuantityAvailable() < item.getQuantity()) {
            throw new RuntimeException("Insufficient stock");
        }

        // ✅ REDUCE STOCK HERE ONLY
        product.setQuantityAvailable(
                product.getQuantityAvailable() - item.getQuantity()
        );

        // ✅ UPDATE STATUS
        item.setStatus(OrderStatus.ORDERED);

        return "Item Approved Successfully";
    }
    // ✅ REJECT ITEM (🔥 FIXED)
    @Transactional
    public String rejectOrderItem(Long itemId, String supervisorEmail) {

        OrderItem item = orderItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        String email =
                item.getProduct()
                        .getFarmer()
                        .getSupervisor()
                        .getUser()
                        .getEmail();

        // 🔐 SECURITY CHECK
        if (!email.equals(supervisorEmail)) {
            throw new RuntimeException("Not authorized");
        }

        // ✅ ONLY PENDING CAN BE REJECTED
        if (item.getStatus() != OrderStatus.PENDING) {
            throw new RuntimeException("Already processed");
        }

        // ❌ NO STOCK CHANGE
        // ✅ ONLY STATUS UPDATE
        item.setStatus(OrderStatus.REJECTED);

        return "Item Rejected Successfully";
    }

    // =========================================================
// 🔥 NEW: ORDERED → COMPLETED / CANCELLED FLOW
// =========================================================

    // ✅ GET ORDERED ITEMS FOR SUPERVISOR
    public List<OrderItemDTO> getOrderedItemsForSupervisor(String email) {

        List<OrderItem> items =
                orderItemRepository.findOrderedItemsBySupervisor(email);

        return items.stream()
                .map(item -> OrderItemDTO.builder()
                        .id(item.getId())
                        .orderId(item.getOrder().getId())
                        .productId(item.getProduct().getId())
                        .productName(item.getProduct().getProductName())
                        .quantity(item.getQuantity())
                        .price(item.getPrice())
                        .status(item.getStatus())
                        .farmName(item.getProduct().getFarmer().getFarmName())
                        .build())
                .toList();
    }

    // ✅ GET ALL ORDERED ITEMS (ADMIN)
    public List<OrderItemDTO> getAllOrderedItems() {

        List<OrderItem> items =
                orderItemRepository.findByStatus(OrderStatus.ORDERED);

        return items.stream()
                .map(item -> OrderItemDTO.builder()
                        .id(item.getId())
                        .orderId(item.getOrder().getId())
                        .productId(item.getProduct().getId())
                        .productName(item.getProduct().getProductName())
                        .quantity(item.getQuantity())
                        .price(item.getPrice())
                        .status(item.getStatus())
                        .farmName(item.getProduct().getFarmer().getFarmName())
                        .build())
                .toList();
    }

// =========================================================

    // ✅ COMPLETE ORDER ITEM
    @Transactional
    public String completeOrderItem(Long itemId, String email, String role) {

        OrderItem item = orderItemRepository.findByIdForUpdate(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        // ✅ ONLY ORDERED ALLOWED
        if (item.getStatus() != OrderStatus.ORDERED) {
            throw new RuntimeException("Only ORDERED items can be completed");
        }

        // 🔐 SUPERVISOR CHECK
        if ("SUPERVISOR".equalsIgnoreCase(role)) {
            String supervisorEmail =
                    item.getProduct()
                            .getFarmer()
                            .getSupervisor()
                            .getUser()
                            .getEmail();

            if (!supervisorEmail.equals(email)) {
                throw new RuntimeException("Not authorized");
            }
        }

        // ✅ ADMIN → no restriction

        item.setStatus(OrderStatus.COMPLETED);

        return "Order Completed Successfully";
    }

// =========================================================

    // ✅ CANCEL ORDER ITEM (WITH QUANTITY RESTORE)
    @Transactional
    public String cancelOrderItem(Long itemId, String email, String role) {

        OrderItem item = orderItemRepository.findByIdForUpdate(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        // ✅ ONLY ORDERED ALLOWED
        if (item.getStatus() != OrderStatus.ORDERED) {
            throw new RuntimeException("Only ORDERED items can be cancelled");
        }

        // 🔐 SUPERVISOR CHECK
        if ("SUPERVISOR".equalsIgnoreCase(role)) {
            String supervisorEmail =
                    item.getProduct()
                            .getFarmer()
                            .getSupervisor()
                            .getUser()
                            .getEmail();

            if (!supervisorEmail.equals(email)) {
                throw new RuntimeException("Not authorized");
            }
        }

        // ✅ RESTORE QUANTITY
        Product product = item.getProduct();
        product.setQuantityAvailable(
                product.getQuantityAvailable() + item.getQuantity()
        );

        item.setStatus(OrderStatus.CANCELLED);

        return "Order Cancelled & Quantity Restored";
    }
    // =========================================================
    // =========================================================
// 🔥 COMPLETED ITEMS
// =========================================================

    // ✅ Supervisor → only his completed items
    public List<OrderItemDTO> getCompletedItemsForSupervisor(String email) {

        List<OrderItem> items =
                orderItemRepository.findCompletedItemsBySupervisor(email);

        return items.stream()
                .map(item -> OrderItemDTO.builder()
                        .id(item.getId())
                        .orderId(item.getOrder().getId())
                        .productId(item.getProduct().getId())
                        .productName(item.getProduct().getProductName())
                        .quantity(item.getQuantity())
                        .price(item.getPrice())
                        .status(item.getStatus())
                        .farmName(item.getProduct().getFarmer().getFarmName())
                        .build())
                .toList();
    }

    // ✅ Admin → all completed items
    public List<OrderItemDTO> getAllCompletedItems() {

        List<OrderItem> items =
                orderItemRepository.findByStatus(OrderStatus.COMPLETED);

        return items.stream()
                .map(item -> OrderItemDTO.builder()
                        .id(item.getId())
                        .orderId(item.getOrder().getId())
                        .productId(item.getProduct().getId())
                        .productName(item.getProduct().getProductName())
                        .quantity(item.getQuantity())
                        .price(item.getPrice())
                        .status(item.getStatus())
                        .farmName(item.getProduct().getFarmer().getFarmName())
                        .build())
                .toList();
    }

    // ✅ MAPPER
    private OrderItemDTO mapToDTO(OrderItem item) {
        return OrderItemDTO.builder()
                .id(item.getId())
                .orderId(item.getOrder() != null ? item.getOrder().getId() : null)
                .productId(item.getProduct() != null ? item.getProduct().getId() : null)
                .quantity(item.getQuantity())
                .price(item.getPrice())
                .status(item.getStatus())
                .build();
    }
}