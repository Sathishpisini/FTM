package com.example.F3M.dto;

import com.example.F3M.enums.RequestStatus;
import lombok.*;
import org.geolatte.geom.Point;


import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FarmerDTO {

    private Long id;

    // ✅ Input
    private Long userId;
    private String farmName;
    private Double farmSize;
    private String village;
    private String userName;
    private String phone;
    private RequestStatus status;
    // ✅ Location (IMPORTANT for frontend map)
    private Double latitude;
    private Double longitude;
    private String email;
    // ✅ Supervisor info
    private Long supervisorId;
    private String supervisorName;
    private String supervisorPhone;
    // ✅ Products
    private Set<Long> productIds;
    // Optional (if you ever want raw geometry)
    private Point location;

}