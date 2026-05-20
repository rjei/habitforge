package org.example.habitforgeclient.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record HabitModel(
        Long id,
        String name,
        String type,
        String category,
        int xpReward,
        int currentStreak,
        LocalDateTime createdAt,
        Integer targetDaysPerWeek,
        LocalDate deadline
) {}