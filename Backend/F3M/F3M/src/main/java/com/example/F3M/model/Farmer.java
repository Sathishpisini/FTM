package com.example.F3M.model;

import com.example.F3M.enums.RequestStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.locationtech.jts.geom.Point;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Type;

@Entity
@Table(name = "farmers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Farmer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String farmName;

    private Double farmSize;

    @Column(nullable = false)
    private String village;

    // PostGIS location
    @Column(columnDefinition = "geometry(Point, 4326)")
    private Point farmLocation;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private RequestStatus status = RequestStatus.PENDING;
    // Supervisor mapping (EAGER fetch to ensure it's loaded)
    @ManyToOne(fetch = FetchType.EAGER) // 🔥 VERY IMPORTANT
    @JoinColumn(name = "supervisor_id", nullable = false)
    @JsonIgnore
    private Supervisor supervisor;

    @OneToMany(mappedBy = "farmer")
    private Set<Product> products;
    private LocalDateTime createdAt;

    @PrePersist
    public void setCreatedAt() {
        this.createdAt = LocalDateTime.now();
    }
}