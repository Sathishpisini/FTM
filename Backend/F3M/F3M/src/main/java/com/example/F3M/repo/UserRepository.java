package com.example.F3M.repo;

import com.example.F3M.model.User;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // ✅ Fetch User + Farmers + Supervisor (SAFE)
    @Query("""
        SELECT u FROM User u
        LEFT JOIN FETCH u.farmers f
        LEFT JOIN FETCH f.supervisor
        WHERE u.id = :id
    """)
    Optional<User> findWithFarmersById(@Param("id") Long id);

    // ✅ Fetch User + Buyers (SAFE)
    @Query("""
        SELECT u FROM User u
        LEFT JOIN FETCH u.buyers b
        WHERE u.id = :id
    """)
    Optional<User> findWithBuyersById(@Param("id") Long id);

    // ✅ Fetch by email (Farmers + Supervisor)
    @Query("""
        SELECT u FROM User u
        LEFT JOIN FETCH u.farmers f
        LEFT JOIN FETCH f.supervisor
        WHERE u.email = :email
    """)
    Optional<User> findWithFarmersByEmail(@Param("email") String email);

    // ✅ Fetch by email (Buyers)
    @Query("""
        SELECT u FROM User u
        LEFT JOIN FETCH u.buyers b
        WHERE u.email = :email
    """)
    Optional<User> findWithBuyersByEmail(@Param("email") String email);

    // ✅ Normal queries
    Optional<User> findByEmail(String email);
    Optional<User> findByPhone(String phone);

    boolean existsByEmail(String email);
    boolean existsByPhone(String phone);
}