package com.example.F3M.controller;

import com.example.F3M.dto.SupervisorDTO;
import com.example.F3M.service.SupervisorService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/supervisors")
@CrossOrigin(origins = "*")
public class SupervisorController {

    private static final Logger log = LoggerFactory.getLogger(SupervisorController.class);

    private final SupervisorService supervisorService;

    public SupervisorController(SupervisorService supervisorService) {
        this.supervisorService = supervisorService;
    }

    // ✅ CREATE
    @PostMapping
    public ResponseEntity<SupervisorDTO> createSupervisor(@RequestBody SupervisorDTO dto) {
        return ResponseEntity.ok(supervisorService.createSupervisor(dto));
    }

    // ✅ GET ALL
    @GetMapping
    public ResponseEntity<List<SupervisorDTO>> getAllSupervisors() {
        return ResponseEntity.ok(supervisorService.getAllSupervisors());
    }

    // ✅ GET BY ID
    @GetMapping("/{id}")
    public ResponseEntity<SupervisorDTO> getSupervisorById(@PathVariable Long id) {
        return ResponseEntity.ok(supervisorService.getSupervisorById(id));
    }

    // ✅ UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<SupervisorDTO> updateSupervisor(@PathVariable Long id,
                                                          @RequestBody SupervisorDTO dto) {
        return ResponseEntity.ok(supervisorService.updateSupervisor(id, dto));
    }

    // ✅ DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSupervisor(@PathVariable Long id) {
        supervisorService.deleteSupervisor(id);
        return ResponseEntity.ok("Supervisor deleted successfully");
    }
    // GS
    @GetMapping("/villages")
    public ResponseEntity<List<String>> getAllVillages() {

        log.info("🔥 GET /villages API called");

        List<String> villages = supervisorService.getAllVillages();

        log.info("✅ Villages sent: {}", villages);

        return ResponseEntity.ok(villages);
    }

    // ✅ OPTIONAL: GET VILLAGES FOR A SPECIFIC SUPERVISOR
    @GetMapping("/{id}/villages")
    public ResponseEntity<String> getVillageBySupervisor(@PathVariable Long id) {
        return ResponseEntity.ok(supervisorService.getVillageBySupervisor(id));
    }

    // ✅ TEST
    @GetMapping("/test")
    public String test() {
        return "SUPERVISOR WORKING";
    }
}