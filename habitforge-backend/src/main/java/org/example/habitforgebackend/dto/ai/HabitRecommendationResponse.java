package org.example.habitforgebackend.dto.ai;

public record HabitRecommendationResponse(
    String name,
    String category,
    String difficulty,
    String reason,
    int suggestedXp
) {}
