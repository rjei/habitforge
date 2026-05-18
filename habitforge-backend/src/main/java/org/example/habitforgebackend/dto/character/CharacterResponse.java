package org.example.habitforgebackend.dto.character;

import java.time.LocalDateTime;

public record CharacterResponse(
        Long id,
        int level,
        int totalXp,
        int xpToNextLevel,
        int disciplineScore,
        int healthScore,
        Double activeXpMultiplier,
        LocalDateTime xpBoostExpiresAt
) {
}
