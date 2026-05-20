package org.example.habitforgebackend.dto.ai;

public record HabitContextDto(
    Long id,
    String name,
    String type,
    String category,
    int currentStreak,
    int xpReward
) {}
