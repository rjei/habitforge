package org.example.habitforgebackend.dto.ai;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

public record DifficultyPredictRequest(
    @NotBlank(message = "Habit name cannot be blank")
    String name,

    @NotBlank(message = "Category cannot be blank")
    String category,

    @NotBlank(message = "Type cannot be blank (DAILY, WEEKLY, CHALLENGE)")
    String type,

    Integer targetDaysPerWeek,
    LocalDate deadline
) {}
