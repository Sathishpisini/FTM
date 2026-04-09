package com.example.F3M.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "supervisors")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Supervisor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;

    private String phone;

    private String village;

    @OneToOne
    @JoinColumn(name = "user_id", unique = true)
    private User user;
    @OneToMany(mappedBy = "supervisor", fetch = FetchType.LAZY)
    private Set<Farmer> farmers = new HashSet<>();
}