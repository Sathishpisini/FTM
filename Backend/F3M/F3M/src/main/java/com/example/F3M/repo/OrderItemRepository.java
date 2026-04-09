package com.example.F3M.repo;

import com.example.F3M.enums.OrderStatus;
import com.example.F3M.model.OrderItem;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    @Query("""
SELECT oi FROM OrderItem oi
WHERE oi.status = 'PENDING'
AND oi.product.farmer.supervisor.user.email = :email
""")
    List<OrderItem> findPendingItemsBySupervisor(@Param("email") String email);
    @Query("""
SELECT oi FROM OrderItem oi
WHERE oi.status = 'ORDERED'
AND oi.product.farmer.supervisor.user.email = :email
""")
    List<OrderItem> findOrderedItemsBySupervisor(@Param("email") String email);
    @Query("""
SELECT oi FROM OrderItem oi
WHERE oi.status = 'COMPLETED'
AND oi.product.farmer.supervisor.user.email = :email
""")
    List<OrderItem> findCompletedItemsBySupervisor(@Param("email") String email);
    List<OrderItem> findByOrderId(Long orderId);
    List<OrderItem> findByStatus(OrderStatus status);
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
    SELECT oi FROM OrderItem oi
    WHERE oi.id = :id
""")
    Optional<OrderItem> findByIdForUpdate(@Param("id") Long id);

}
