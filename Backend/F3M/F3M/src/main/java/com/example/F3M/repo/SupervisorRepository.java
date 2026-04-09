package com.example.F3M.repo;

import com.example.F3M.model.Supervisor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface SupervisorRepository extends JpaRepository<Supervisor, Long> {
    //GS
    @Query("SELECT DISTINCT s.village FROM Supervisor s WHERE s.village IS NOT NULL AND s.village <> ''")
    List<String> findDistinctVillages();
    // ✅ Existing (keep it)
    List<Supervisor> findByVillageIgnoreCase(String village);

    // ✅ Best match: same village + least assigned farmers
    @Query("""
        SELECT s
        FROM Supervisor s
        LEFT JOIN s.farmers f
        WHERE LOWER(TRIM(s.village)) = LOWER(TRIM(:village))
        GROUP BY s
        ORDER BY COUNT(f) ASC
    """)
    List<Supervisor> findLeastLoadedByVillage(@Param("village") String village);
    Optional<Supervisor> findByUser_Id(Long userId);
    // ✅ Fallback: overall least loaded supervisor
    @Query("""
        SELECT s
        FROM Supervisor s
        LEFT JOIN s.farmers f
        GROUP BY s
        ORDER BY COUNT(f) ASC
    """)
    List<Supervisor> findLeastLoadedOverall();
}