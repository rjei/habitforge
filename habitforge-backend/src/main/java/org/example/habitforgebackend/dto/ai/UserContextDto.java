package org.example.habitforgebackend.dto.ai;

import java.util.List;

public record UserContextDto(
    String username,
    int level,
    int totalXp,
    int disciplineScore,
    int healthScore,
    List<HabitContextDto> activeHabits,
    double weeklyCompletionRate,
    List<MoodContextDto> recentMoods
) {}
