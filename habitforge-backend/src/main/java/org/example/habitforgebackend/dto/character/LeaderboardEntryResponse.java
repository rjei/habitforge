package org.example.habitforgebackend.dto.character;

public record LeaderboardEntryResponse(
        int rank,
        String name,
        int level,
        int totalXp,
        String avatar,
        boolean isCurrentUser
) {
}
