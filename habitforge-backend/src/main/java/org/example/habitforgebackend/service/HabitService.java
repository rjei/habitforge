package org.example.habitforgebackend.service;

import org.example.habitforgebackend.dto.habit.HabitCreateRequest;
import org.example.habitforgebackend.dto.habit.HabitLogResponse;
import org.example.habitforgebackend.dto.habit.HabitResponse;
import org.example.habitforgebackend.dto.habit.HabitUpdateRequest;
import org.example.habitforgebackend.model.*;
import org.example.habitforgebackend.repository.HabitLogRepository;
import org.example.habitforgebackend.repository.HabitRepository;
import org.example.habitforgebackend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class HabitService {
    private final HabitRepository habitRepository;
    private final HabitLogRepository habitLogRepository;
    private final UserRepository userRepository;

    public HabitService(
            HabitRepository habitRepository,
            HabitLogRepository habitLogRepository,
            UserRepository userRepository
    ) {
        this.habitRepository = habitRepository;
        this.habitLogRepository = habitLogRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public HabitResponse createHabit(String username, HabitCreateRequest request) {
        User user = getUserByUsername(username);
        Habit habit;
        if (request.type() == HabitType.WEEKLY) {
            WeeklyHabit weeklyHabit = new WeeklyHabit();
            weeklyHabit.setTargetDaysPerWeek(request.targetDaysPerWeek() == null ? 3 : request.targetDaysPerWeek());
            habit = weeklyHabit;
        } else if (request.type() == HabitType.CHALLENGE) {
            ChallengeHabit challengeHabit = new ChallengeHabit();
            challengeHabit.setDeadline(request.deadline());
            habit = challengeHabit;
        } else {
            habit = new DailyHabit();
        }

        habit.setUser(user);
        habit.setName(request.name());
        habit.setCategory(request.category());
        habit.setXpReward(request.xpReward());
        Habit saved = habitRepository.save(habit);
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<HabitResponse> getHabits(String username) {
        User user = getUserByUsername(username);
        return habitRepository.findByUserAndDeletedFalse(user).stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public HabitResponse getHabitById(String username, Long habitId) {
        User user = getUserByUsername(username);
        Habit habit = getOwnedHabit(habitId, user);
        return toResponse(habit);
    }

    @Transactional
    public HabitResponse updateHabit(String username, Long habitId, HabitUpdateRequest request) {
        User user = getUserByUsername(username);
        Habit habit = getOwnedHabit(habitId, user);

        habit.setName(request.name());
        habit.setCategory(request.category());
        habit.setXpReward(request.xpReward());

        if (habit instanceof WeeklyHabit weeklyHabit && request.targetDaysPerWeek() != null) {
            weeklyHabit.setTargetDaysPerWeek(request.targetDaysPerWeek());
        }
        if (habit instanceof ChallengeHabit challengeHabit) {
            challengeHabit.setDeadline(request.deadline());
        }

        return toResponse(habitRepository.save(habit));
    }

    @Transactional
    public void deleteHabit(String username, Long habitId) {
        User user = getUserByUsername(username);
        Habit habit = getOwnedHabit(habitId, user);
        habit.setDeleted(true);
        habitRepository.save(habit);
    }

    @Transactional
    public HabitResponse completeHabit(String username, Long habitId) {
        User user = getUserByUsername(username);
        Habit habit = getOwnedHabit(habitId, user);

        LocalDate today = LocalDate.now();
        if (!habit.isCompletionValid(today)) {
            throw new IllegalArgumentException("Habit completion not valid for current date");
        }
        if (habitLogRepository.existsByHabitIdAndCompletedAtBetween(
                habitId,
                today.atStartOfDay(),
                today.plusDays(1).atStartOfDay().minusNanos(1)
        )) {
            throw new IllegalArgumentException("Habit already completed today");
        }

        habit.setCurrentStreak(habit.getCurrentStreak() + 1);
        int xp = (int) Math.round(habit.calculateXp());

        HabitLog log = new HabitLog();
        log.setHabit(habit);
        log.setUser(user);
        log.setXpEarned(xp);
        log.setCompletedAt(LocalDateTime.now());
        habitLogRepository.save(log);

        return toResponse(habitRepository.save(habit));
    }

    @Transactional(readOnly = true)
    public List<HabitLogResponse> getHabitLogs(String username, Long habitId) {
        User user = getUserByUsername(username);
        getOwnedHabit(habitId, user);
        return habitLogRepository.findByHabitIdAndUserIdOrderByCompletedAtDesc(habitId, user.getId())
                .stream()
                .map(log -> new HabitLogResponse(log.getId(), log.getXpEarned(), log.getCompletedAt()))
                .toList();
    }

    private User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    private Habit getOwnedHabit(Long habitId, User user) {
        return habitRepository.findByIdAndUserAndDeletedFalse(habitId, user)
                .orElseThrow(() -> new IllegalArgumentException("Habit not found"));
    }

    private HabitResponse toResponse(Habit habit) {
        Integer targetDays = habit instanceof WeeklyHabit weeklyHabit ? weeklyHabit.getTargetDaysPerWeek() : null;
        java.time.LocalDate deadline = habit instanceof ChallengeHabit challengeHabit ? challengeHabit.getDeadline() : null;
        return new HabitResponse(
                habit.getId(),
                habit.getName(),
                habit.getType() != null ? habit.getType().name() : habit.getClass().getSimpleName().replace("Habit", "").toUpperCase(),
                habit.getCategory(),
                habit.getXpReward(),
                habit.getCurrentStreak(),
                habit.getCreatedAt(),
                targetDays,
                deadline
        );
    }
}

