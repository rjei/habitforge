package org.example.habitforgebackend.dto.habit;

import jakarta.validation.constraints.*;
import org.example.habitforgebackend.model.HabitType;

import java.time.LocalDate;

public record HabitCreateRequest(
        @NotBlank @Size(min = 3, max = 100) String name,
        @NotBlank @Size(max = 50) String category,
        @NotNull HabitType type,
        @Min(10) @Max(1000) int xpReward,
        @Min(1) @Max(7) Integer targetDaysPerWeek,
        @FutureOrPresent LocalDate deadline
) {
}


