package com.example.F3M.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CropVideoDTO {

    private Long id;   // ✅ ADD THIS

    private String title;
    private String description;
    private String videoUrl;
    private Long farmerId;
}