package com.example.F3M.dto;

import lombok.*;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SupervisorDTO {

    private Long id;
    private String name;
    private String phone;
    private String village;

    private Set<FarmerDTO> farmers;
}