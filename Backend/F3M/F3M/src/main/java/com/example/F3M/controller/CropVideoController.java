package com.example.F3M.controller;

import com.example.F3M.dto.CropVideoDTO;
import com.example.F3M.service.CropVideoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/videos")
public class CropVideoController {

    private final CropVideoService videoService;

    public CropVideoController(CropVideoService videoService) {
        this.videoService = videoService;
    }

    // ✅ CREATE
    @PostMapping
    public ResponseEntity<CropVideoDTO> addVideo(@RequestBody CropVideoDTO dto) {
        return ResponseEntity.ok(videoService.addVideo(dto));
    }

    // ✅ UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<CropVideoDTO> updateVideo(@PathVariable Long id,
                                                    @RequestBody CropVideoDTO dto) {
        return ResponseEntity.ok(videoService.updateVideo(id, dto));
    }

    // ✅ DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteVideo(@PathVariable Long id) {
        videoService.deleteVideo(id);
        return ResponseEntity.ok("Video deleted successfully");
    }

    // ✅ GET ALL
    @GetMapping
    public ResponseEntity<List<CropVideoDTO>> getAllVideos() {
        return ResponseEntity.ok(videoService.getAllVideos());
    }

    // ✅ GET BY FARMER
    @GetMapping("/farmer/{farmerId}")
    public ResponseEntity<List<CropVideoDTO>> getVideos(@PathVariable Long farmerId) {
        return ResponseEntity.ok(videoService.getFarmerVideos(farmerId));
    }

    // ✅ TEST
    @GetMapping("/test")
    public String test() {
        return "VIDEO WORKING";
    }
}