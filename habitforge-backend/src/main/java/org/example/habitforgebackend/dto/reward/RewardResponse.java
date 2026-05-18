package org.example.habitforgebackend.dto.reward;

import java.time.LocalDateTime;

public record RewardResponse(
        Long id,
        String name,
        String description,
        String rewardType,
        String rarity,
        String iconUrl,
        LocalDateTime earnedAt
) {
}
