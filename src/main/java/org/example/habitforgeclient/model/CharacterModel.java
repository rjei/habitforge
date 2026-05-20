package org.example.habitforgeclient.model;

import java.time.LocalDateTime;

public record CharacterModel(
        Long id,
        int level,
        int totalXp,
        int xpToNextLevel,
        int disciplineScore,
        int healthScore,
        Double activeXpMultiplier,
        LocalDateTime xpBoostExpiresAt
) {}