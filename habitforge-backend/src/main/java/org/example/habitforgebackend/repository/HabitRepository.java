package org.example.habitforgebackend.repository;

import org.example.habitforgebackend.model.Habit;
import org.example.habitforgebackend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface HabitRepository extends JpaRepository<Habit, Long> {
    List<Habit> findByUserAndDeletedFalse(User user);
    Optional<Habit> findByIdAndUserAndDeletedFalse(Long id, User user);
}

