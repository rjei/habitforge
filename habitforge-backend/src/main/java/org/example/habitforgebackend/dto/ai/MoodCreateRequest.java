package org.example.habitforgebackend.dto.ai;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

public record MoodCreateRequest(
    @Min(value = 1, message = "Mood score must be at least 1")
    @Max(value = 5, message = "Mood score must not exceed 5")
    int moodScore,

    @Size(max = 500, message = "Note must not exceed 500 characters")
    String note
) {}
