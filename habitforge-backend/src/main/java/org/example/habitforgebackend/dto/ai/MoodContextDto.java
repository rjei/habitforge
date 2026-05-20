package org.example.habitforgebackend.dto.ai;

import java.time.LocalDateTime;

public record MoodContextDto(
    int moodScore,
    String note,
    LocalDateTime loggedAt
) {}
