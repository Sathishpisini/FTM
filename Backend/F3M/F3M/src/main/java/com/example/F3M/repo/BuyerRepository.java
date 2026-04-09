package com.example.F3M.repo;

import com.example.F3M.enums.RequestStatus;
import com.example.F3M.model.Buyer;
import com.example.F3M.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BuyerRepository extends JpaRepository<Buyer, Long> {

    Optional<Buyer> findByUserId(Long userId);
    List<Buyer> findByUser_Id(Long userId);
    List<Buyer> findByStatus(RequestStatus status);
    List<Buyer> findByStatusIn(List<RequestStatus> statuses);
    List<Buyer> findByUser_IdAndStatus(Long userId, RequestStatus status);
    @Query("""
    SELECT u FROM User u
    LEFT JOIN FETCH u.farmers f
    LEFT JOIN FETCH f.supervisor
    LEFT JOIN FETCH u.buyers
    WHERE u.id = :id
""")
    Optional<User> findByIdWithDetails(@Param("id") Long id);

}