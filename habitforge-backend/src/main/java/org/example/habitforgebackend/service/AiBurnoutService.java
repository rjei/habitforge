package org.example.habitforgebackend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.habitforgebackend.dto.ai.BurnoutCheckResponse;
import org.example.habitforgebackend.dto.ai.UserContextDto;
import org.example.habitforgebackend.model.*;
import org.example.habitforgebackend.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class AiBurnoutService {

    private static final Logger log = LoggerFactory.getLogger(AiBurnoutService.class);

    private final UserRepository userRepository;
    private final HabitRepository habitRepository;
    private final HabitLogRepository habitLogRepository;
    private final UserContextBuilder userContextBuilder;
    private final LlmClient llmClient;
    private final ObjectMapper objectMapper;

    public AiBurnoutService(
            UserRepository userRepository,
            HabitRepository habitRepository,
            HabitLogRepository habitLogRepository,
            UserContextBuilder userContextBuilder,
            LlmClient llmClient
    ) {
        this.userRepository = userRepository;
        this.habitRepository = habitRepository;
        this.habitLogRepository = habitLogRepository;
        this.userContextBuilder = userContextBuilder;
        this.llmClient = llmClient;
        this.objectMapper = new ObjectMapper();
    }

    @Transactional(readOnly = true)
    public BurnoutCheckResponse checkBurnout(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));

        List<Habit> activeHabits = habitRepository.findByUserAndDeletedFalse(user);
        UserContextDto context = userContextBuilder.buildContext(username);

        double burnoutScore = 0.0;

        // 1. Check if active habits > 8
        if (activeHabits.size() > 8) {
            burnoutScore += 0.3;
        }

        // 2. Check if completion rate dropped by > 30%
        LocalDateTime fourteenDaysAgo = LocalDateTime.now().minusDays(14);
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);

        int prevExpected = 0;
        int prevActual = 0;
        int brokenStreaksCount = 0;

        for (Habit habit : activeHabits) {
            List<HabitLog> logs = habitLogRepository.findByHabitIdAndUserIdOrderByCompletedAtDesc(habit.getId(), user.getId());

            // Check if streak was broken (habit has history logs but current streak is 0)
            if (habit.getCurrentStreak() == 0 && !logs.isEmpty()) {
                brokenStreaksCount++;
            }

            if (habit.getCreatedAt().isAfter(sevenDaysAgo)) {
                // Habit did not exist during the previous week
                continue;
            }

            long daysSinceCreation = ChronoUnit.DAYS.between(habit.getCreatedAt(), sevenDaysAgo);
            long activePrevDays = Math.max(1, Math.min(7, daysSinceCreation + 1));

            int expectedForThisHabit;
            if (habit instanceof WeeklyHabit weeklyHabit) {
                int target = weeklyHabit.getTargetDaysPerWeek();
                expectedForThisHabit = (int) Math.min(target, activePrevDays);
            } else {
                expectedForThisHabit = (int) activePrevDays;
            }
            prevExpected += expectedForThisHabit;

            long actualForThisHabit = logs.stream()
                    .filter(l -> l.getCompletedAt() != null)
                    .filter(l -> l.getCompletedAt().isAfter(fourteenDaysAgo) && l.getCompletedAt().isBefore(sevenDaysAgo))
                    .count();
            prevActual += actualForThisHabit;
        }

        double prevCompletionRate = prevExpected > 0 ? (double) prevActual / prevExpected : 0.0;
        prevCompletionRate = Math.min(1.0, Math.max(0.0, prevCompletionRate));

        double currentCompletionRate = context.weeklyCompletionRate();
        if (prevExpected > 0 && (prevCompletionRate - currentCompletionRate) > 0.30) {
            burnoutScore += 0.4;
        }

        // 3. Check if 3+ streaks broken simultaneously
        if (brokenStreaksCount >= 3) {
            burnoutScore += 0.3;
        }

        // Cap burnoutScore between 0.0 and 1.0
        burnoutScore = Math.min(1.0, Math.max(0.0, burnoutScore));
        boolean isBurnoutRisk = burnoutScore >= 0.5;

        if (isBurnoutRisk) {
            String systemInstruction = "You are StreakQuest AI Burnout Detector.\n" +
                    "The user is at risk of burnout (burnout score: " + String.format("%.2f", burnoutScore) + ").\n" +
                    "Analyze their context and generate an empathetic message and load reduction suggestions.\n" +
                    "Return response ONLY as a JSON object with exactly two keys:\n" +
                    "- \"empatheticMessage\": String (validating their effort, acknowledging the challenge, and comforting them)\n" +
                    "- \"recommendations\": String (practical advice, e.g., which habits to pause or reduce targets)\n" +
                    "Do not include any wrapping markdown formatting or text besides the valid JSON.";

            String userPrompt = "User status:\n" +
                    "- Active Habits Count: " + activeHabits.size() + "\n" +
                    "- Weekly Completion Rate: " + String.format("%.1f%%", currentCompletionRate * 100) + "\n" +
                    "- Previous Week Completion Rate: " + String.format("%.1f%%", prevCompletionRate * 100) + "\n" +
                    "- Broken Streaks: " + brokenStreaksCount + "\n" +
                    "- Recent Moods: " + context.recentMoods().stream().map(m -> m.moodScore() + "/5").toList();

            try {
                String jsonOutput = llmClient.generateStructuredContent(systemInstruction, userPrompt);
                jsonOutput = cleanJsonText(jsonOutput);
                JsonNode root = objectMapper.readTree(jsonOutput);
                String message = root.path("empatheticMessage").asText();
                String recommendations = root.path("recommendations").asText();
                return new BurnoutCheckResponse(burnoutScore, true, message, recommendations);
            } catch (Exception e) {
                log.error("Failed calling Gemini for burnout advice, using fallback: {}", e.getMessage());
                return getFallbackBurnoutResponse(burnoutScore, activeHabits.size(), brokenStreaksCount);
            }
        } else {
            return new BurnoutCheckResponse(
                    burnoutScore,
                    false,
                    "No significant signs of burnout detected. Your workload looks healthy. Keep up the good work!",
                    "Maintain your current pace. Remember to take short breaks and listen to your body."
            );
        }
    }

    private String cleanJsonText(String text) {
        if (text == null) return "";
        text = text.trim();
        if (text.startsWith("```")) {
            int firstNewLine = text.indexOf('\n');
            if (firstNewLine != -1) {
                text = text.substring(firstNewLine + 1);
            }
            if (text.endsWith("```")) {
                text = text.substring(0, text.length() - 3);
            }
        }
        return text.trim();
    }

    private BurnoutCheckResponse getFallbackBurnoutResponse(double score, int activeCount, int brokenCount) {
        return new BurnoutCheckResponse(
                score,
                true,
                "I notice you're pushing yourself hard with " + activeCount + " active habits, but your completion rate has dropped. " +
                        "It's completely okay to step back. Consistency is a marathon, not a sprint.",
                "Consider pausing 1-2 non-essential habits. Focus on keeping your top 3 core habits alive instead of completing everything."
        );
    }
}
