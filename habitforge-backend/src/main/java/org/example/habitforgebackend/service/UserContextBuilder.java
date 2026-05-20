package org.example.habitforgebackend.service;

import org.example.habitforgebackend.dto.ai.UserContextDto;
import org.example.habitforgebackend.dto.ai.HabitContextDto;
import org.example.habitforgebackend.dto.ai.MoodContextDto;
import org.example.habitforgebackend.model.*;
import org.example.habitforgebackend.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Service
public class UserContextBuilder {
    private final UserRepository userRepository;
    private final GameCharacterRepository characterRepository;
    private final HabitRepository habitRepository;
    private final HabitLogRepository habitLogRepository;
    private final MoodLogRepository moodLogRepository;

    public UserContextBuilder(
            UserRepository userRepository,
            GameCharacterRepository characterRepository,
            HabitRepository habitRepository,
            HabitLogRepository habitLogRepository,
            MoodLogRepository moodLogRepository
    ) {
        this.userRepository = userRepository;
        this.characterRepository = characterRepository;
        this.habitRepository = habitRepository;
        this.habitLogRepository = habitLogRepository;
        this.moodLogRepository = moodLogRepository;
    }

    @Transactional(readOnly = true)
    public UserContextDto buildContext(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));

        GameCharacter character = characterRepository.findByUser(user)
                .orElseGet(() -> GameCharacter.forUser(user));

        List<Habit> activeHabits = habitRepository.findByUserAndDeletedFalse(user);

        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        int totalExpected = 0;
        int totalActual = 0;

        List<HabitContextDto> habitContexts = new ArrayList<>();
        for (Habit habit : activeHabits) {
            habitContexts.add(new HabitContextDto(
                    habit.getId(),
                    habit.getName(),
                    habit.getType() != null ? habit.getType().name() : habit.getClass().getSimpleName().replace("Habit", "").toUpperCase(),
                    habit.getCategory(),
                    habit.getCurrentStreak(),
                    habit.getXpReward()
            ));

            long daysSinceCreation = ChronoUnit.DAYS.between(habit.getCreatedAt(), LocalDateTime.now());
            long activeDays = Math.max(1, Math.min(7, daysSinceCreation + 1));

            int expectedForThisHabit;
            if (habit instanceof WeeklyHabit weeklyHabit) {
                int target = weeklyHabit.getTargetDaysPerWeek();
                expectedForThisHabit = (int) Math.min(target, activeDays);
            } else {
                expectedForThisHabit = (int) activeDays;
            }
            totalExpected += expectedForThisHabit;

            List<HabitLog> logs = habitLogRepository.findByHabitIdAndUserIdOrderByCompletedAtDesc(habit.getId(), user.getId());
            long actualForThisHabit = logs.stream()
                    .filter(log -> log.getCompletedAt().isAfter(sevenDaysAgo))
                    .count();
            totalActual += actualForThisHabit;
        }

        double completionRate = totalExpected > 0 ? (double) totalActual / totalExpected : 0.0;
        completionRate = Math.min(1.0, Math.max(0.0, completionRate));

        List<MoodLog> moodLogs = moodLogRepository.findByUserAndLoggedAtAfterOrderByLoggedAtDesc(user, sevenDaysAgo);
        List<MoodContextDto> moodContexts = moodLogs.stream()
                .map(m -> new MoodContextDto(m.getMoodScore(), m.getNote(), m.getLoggedAt()))
                .toList();

        return new UserContextDto(
                user.getUsername(),
                character.getLevel(),
                character.getTotalXp(),
                character.getDisciplineScore(),
                character.getHealthScore(),
                habitContexts,
                completionRate,
                moodContexts
        );
    }
}
