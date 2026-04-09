package com.example.F3M.repo;

import com.example.F3M.enums.RequestStatus;
import com.example.F3M.model.Farmer;
import com.example.F3M.model.Product;
import com.example.F3M.model.Supervisor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface FarmerRepository extends JpaRepository<Farmer, Long> {

    // ✅ FIXED (nested property)
    List<Farmer> findByUser_Id(Long userId);
    List<Farmer> findByStatus(RequestStatus status);
    // ✅ already correct
    List<Farmer> findBySupervisor_IdAndStatus(Long supervisorId, RequestStatus status);
    List<Farmer> findByUser_Email(String email);
    List<Farmer> findBySupervisor_Id(Long supervisorId);
    List<Farmer> findBySupervisor_User_Email(String email);
    List<Farmer> findByUser_IdAndStatus(Long userId, RequestStatus status);
    // ✅ custom query
    @Query("SELECT f.village FROM Farmer f WHERE f.supervisor.id = :supervisorId")
    List<String> findVillagesBySupervisorId(@Param("supervisorId") Long supervisorId);
}