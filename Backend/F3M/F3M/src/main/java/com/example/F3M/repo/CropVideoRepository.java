package com.example.F3M.repo;

import com.example.F3M.model.CropVideo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CropVideoRepository extends JpaRepository<CropVideo, Long> {

    List<CropVideo> findByFarmerId(Long farmerId);
}