package org.example.habitforgebackend.repository;

import org.example.habitforgebackend.model.HabitLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface HabitLogRepository extends JpaRepository<HabitLog, Long> {
    List<HabitLog> findByHabitIdOrderByCompletedAtDesc(Long habitId);
    List<HabitLog> findByHabitIdAndUserIdOrderByCompletedAtDesc(Long habitId, Long userId);
    boolean existsByHabitIdAndCompletedAtBetween(Long habitId, LocalDateTime start, LocalDateTime end);
}

