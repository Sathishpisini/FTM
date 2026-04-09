package com.example.F3M.service;

import com.example.F3M.dto.CropVideoDTO;
import com.example.F3M.model.CropVideo;
import com.example.F3M.model.Farmer;
import com.example.F3M.repo.CropVideoRepository;
import com.example.F3M.repo.FarmerRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CropVideoService {

    private final CropVideoRepository cropVideoRepository;
    private final FarmerRepository farmerRepository;

    public CropVideoService(CropVideoRepository cropVideoRepository,
                            FarmerRepository farmerRepository) {
        this.cropVideoRepository = cropVideoRepository;
        this.farmerRepository = farmerRepository;
    }

    // ✅ CREATE
    public CropVideoDTO addVideo(CropVideoDTO dto) {
        Farmer farmer = farmerRepository.findById(dto.getFarmerId())
                .orElseThrow(() -> new RuntimeException("Farmer not found"));

        CropVideo video = CropVideo.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .videoUrl(dto.getVideoUrl())
                .farmer(farmer)
                .build();

        CropVideo saved = cropVideoRepository.save(video);
        return mapToDTO(saved);
    }

    // ✅ UPDATE
    public CropVideoDTO updateVideo(Long id, CropVideoDTO dto) {
        CropVideo video = cropVideoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Video not found"));

        if (dto.getTitle() != null) video.setTitle(dto.getTitle());
        if (dto.getDescription() != null) video.setDescription(dto.getDescription());
        if (dto.getVideoUrl() != null) video.setVideoUrl(dto.getVideoUrl());
        if (dto.getFarmerId() != null) {
            Farmer farmer = farmerRepository.findById(dto.getFarmerId())
                    .orElseThrow(() -> new RuntimeException("Farmer not found"));
            video.setFarmer(farmer);
        }

        CropVideo updated = cropVideoRepository.save(video);
        return mapToDTO(updated);
    }

    // ✅ DELETE
    public void deleteVideo(Long id) {
        CropVideo video = cropVideoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Video not found"));
        cropVideoRepository.delete(video);
    }

    // ✅ GET ALL
    public List<CropVideoDTO> getAllVideos() {
        return cropVideoRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    // ✅ GET BY FARMER
    public List<CropVideoDTO> getFarmerVideos(Long farmerId) {
        return cropVideoRepository.findByFarmerId(farmerId)
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    // ✅ MAPPER
    private CropVideoDTO mapToDTO(CropVideo video) {
        return CropVideoDTO.builder()
                .id(video.getId())
                .title(video.getTitle())
                .description(video.getDescription())
                .videoUrl(video.getVideoUrl())
                .farmerId(video.getFarmer() != null ? video.getFarmer().getId() : null)
                .build();
    }
}