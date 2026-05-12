package org.example.habitforgebackend.dto.habit;

import jakarta.validation.constraints.*;

import java.time.LocalDate;

public record HabitUpdateRequest(
        @NotBlank @Size(min = 3, max = 100) String name,
        @NotBlank @Size(max = 50) String category,
        @Min(10) @Max(1000) int xpReward,
        @Min(1) @Max(7) Integer targetDaysPerWeek,
        @FutureOrPresent LocalDate deadline
) {
}


