package org.example.habitforgebackend.dto.ai;

import java.time.LocalDateTime;

public record MoodResponse(
    Long id,
    int moodScore,
    String note,
    LocalDateTime loggedAt
) {}
