package org.example.habitforgebackend.dto.habit;

import java.time.LocalDateTime;

public record HabitLogResponse(
        Long id,
        int xpEarned,
        LocalDateTime completedAt
) {
}


