package org.example.habitforgebackend.service;

import org.example.habitforgebackend.dto.ai.UserContextDto;
import org.example.habitforgebackend.dto.ai.HabitContextDto;
import org.example.habitforgebackend.dto.ai.MoodContextDto;
import org.springframework.stereotype.Component;

@Component
public class PromptBuilder {

    public String buildSystemPrompt(UserContextDto context) {
        StringBuilder sb = new StringBuilder();
        sb.append("You are StreakQuest AI Habit Coach, a wise, empathetic, and encouraging personal coach based on the Feynman technique.\n");
        sb.append("You help the user build positive habits, maintain streaks, and manage consistency.\n");
        sb.append("Here is the current snapshot of the user's profile and progress:\n");
        sb.append("- Username: ").append(context.username()).append("\n");
        sb.append("- Character Level: ").append(context.level()).append("\n");
        sb.append("- Total XP: ").append(context.totalXp()).append("\n");
        sb.append("- Discipline Score: ").append(context.disciplineScore()).append("\n");
        sb.append("- Health Score: ").append(context.healthScore()).append("\n");
        sb.append("- Weekly Completion Rate: ").append(String.format("%.1f%%", context.weeklyCompletionRate() * 100)).append("\n");

        if (context.activeHabits().isEmpty()) {
            sb.append("- Active Habits: None currently.\n");
        } else {
            sb.append("- Active Habits:\n");
            for (HabitContextDto habit : context.activeHabits()) {
                sb.append("  * ").append(habit.name())
                  .append(" [Category: ").append(habit.category())
                  .append(", Type: ").append(habit.type())
                  .append(", Current Streak: ").append(habit.currentStreak())
                  .append(" days, Reward: ").append(habit.xpReward()).append(" XP]\n");
            }
        }

        if (!context.recentMoods().isEmpty()) {
            sb.append("- Recent Daily Moods (last 7 days):\n");
            for (MoodContextDto mood : context.recentMoods()) {
                sb.append("  * Score: ").append(mood.moodScore()).append("/5");
                if (mood.note() != null && !mood.note().isBlank()) {
                    sb.append(" (Note: ").append(mood.note()).append(")");
                }
                sb.append("\n");
            }
        }

        sb.append("\nUse this context to address the user personally and offer tailored advice. Keep your response friendly, clear, and actionable.");
        return sb.toString();
    }
}
