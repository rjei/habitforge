package org.example.habitforgebackend.dto.habit;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record HabitResponse(
        Long id,
        String name,
        String type,
        String category,
        int xpReward,
        int currentStreak,
        LocalDateTime createdAt,
        Integer targetDaysPerWeek,
        LocalDate deadline
) {
}


