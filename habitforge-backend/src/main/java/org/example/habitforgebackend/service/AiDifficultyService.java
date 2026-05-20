package org.example.habitforgebackend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.habitforgebackend.dto.ai.DifficultyPredictRequest;
import org.example.habitforgebackend.dto.ai.DifficultyPredictResponse;
import org.example.habitforgebackend.dto.ai.UserContextDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class AiDifficultyService {

    private static final Logger log = LoggerFactory.getLogger(AiDifficultyService.class);

    private final UserContextBuilder userContextBuilder;
    private final LlmClient llmClient;
    private final ObjectMapper objectMapper;

    public AiDifficultyService(
            UserContextBuilder userContextBuilder,
            LlmClient llmClient
    ) {
        this.userContextBuilder = userContextBuilder;
        this.llmClient = llmClient;
        this.objectMapper = new ObjectMapper();
    }

    public DifficultyPredictResponse predictDifficulty(String username, DifficultyPredictRequest request) {
        UserContextDto context = userContextBuilder.buildContext(username);

        String systemInstruction = "You are StreakQuest AI Habit Difficulty Predictor.\n" +
                "Analyze a proposed new habit based on the user's workload.\n" +
                "Predict the difficulty, chance of success, advice, and best time range to perform it.\n" +
                "Return response ONLY as a JSON object with exactly these keys:\n" +
                "- \"difficulty\": String (EASY, MEDIUM, or HARD)\n" +
                "- \"successChance\": Integer (1 to 100 representing percentage chance of success)\n" +
                "- \"advice\": String (one sentence of practical advice to build this habit successfully)\n" +
                "- \"bestTime\": String (recommended time frame to perform this habit, e.g. \"Morning (07:00 - 08:30)\")\n" +
                "Do not include any wrapping markdown formatting or text besides the valid JSON.";

        String userPrompt = "User snapshot:\n" +
                "- Active Habits Count: " + context.activeHabits().size() + "\n" +
                "- Completion Rate: " + String.format("%.1f%%", context.weeklyCompletionRate() * 100) + "\n" +
                "Proposed Habit:\n" +
                "- Name: " + request.name() + "\n" +
                "- Category: " + request.category() + "\n" +
                "- Type: " + request.type() + "\n" +
                "- Target Days (if weekly): " + request.targetDaysPerWeek() + "\n" +
                "- Deadline (if challenge): " + request.deadline();

        try {
            String jsonOutput = llmClient.generateStructuredContent(systemInstruction, userPrompt);
            jsonOutput = cleanJsonText(jsonOutput);
            JsonNode root = objectMapper.readTree(jsonOutput);
            String difficulty = root.path("difficulty").asText("MEDIUM");
            int successChance = root.path("successChance").asInt(60);
            String advice = root.path("advice").asText("Consistency is key to forming habits.");
            String bestTime = root.path("bestTime").asText("Morning (08:00 - 09:00)");

            return new DifficultyPredictResponse(difficulty, successChance, advice, bestTime);
        } catch (Exception e) {
            log.error("Failed to predict habit difficulty, returning fallback: {}", e.getMessage());
            return getFallbackResponse(request);
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

    private DifficultyPredictResponse getFallbackResponse(DifficultyPredictRequest request) {
        return new DifficultyPredictResponse(
                "MEDIUM",
                50,
                "Start small, link this habit to an existing routine, and focus on consistency before intensity.",
                "Morning (08:00 - 09:00)"
        );
    }
}
