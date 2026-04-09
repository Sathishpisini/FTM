package com.example.F3M.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FarmDTO {

    private Long id;
    private String name;
    private Double latitude;
    private Double longitude;

}