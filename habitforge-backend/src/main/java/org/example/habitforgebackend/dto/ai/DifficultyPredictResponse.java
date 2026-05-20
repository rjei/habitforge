package org.example.habitforgebackend.dto.ai;

public record DifficultyPredictResponse(
    String difficulty,
    int successChance,
    String advice,
    String bestTime
) {}
