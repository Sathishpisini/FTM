package com.example.F3M.repo;

import com.example.F3M.model.Buyer;
import com.example.F3M.model.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {

    // Find all companies associated with the given buyer
    List<Company> findByBuyer(Buyer buyer);
}