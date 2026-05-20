package org.example.habitforgebackend.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.habitforgebackend.dto.ai.HabitRecommendationResponse;
import org.example.habitforgebackend.dto.ai.UserContextDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AiRecommendationService {

    private static final Logger log = LoggerFactory.getLogger(AiRecommendationService.class);

    private final UserContextBuilder userContextBuilder;
    private final LlmClient llmClient;
    private final ObjectMapper objectMapper;

    public AiRecommendationService(
            UserContextBuilder userContextBuilder,
            LlmClient llmClient
    ) {
        this.userContextBuilder = userContextBuilder;
        this.llmClient = llmClient;
        this.objectMapper = new ObjectMapper();
    }

    public List<HabitRecommendationResponse> getRecommendations(String username) {
        UserContextDto context = userContextBuilder.buildContext(username);

        String systemInstruction = "You are StreakQuest AI Habit Recommender.\n" +
                "Analyze the user's active habits, category distribution, and level.\n" +
                "Suggest exactly 3 new habits tailored to balance their workload.\n" +
                "Return the response ONLY as a JSON array containing objects with the following keys:\n" +
                "- \"name\": String (the habit's title)\n" +
                "- \"category\": String (Health, Fitness, Mindfulness, Discipline, or Learning)\n" +
                "- \"difficulty\": String (EASY, MEDIUM, or HARD)\n" +
                "- \"reason\": String (empathetic reason explaining why this benefits the user's character stats)\n" +
                "- \"suggestedXp\": Integer (suggested reward points: 10 to 50 based on difficulty)\n" +
                "Do not include any wrapping markdown formatting or text besides the valid JSON array.";

        String userPrompt = "User snapshot:\n" +
                "- Level: " + context.level() + "\n" +
                "- Discipline Score: " + context.disciplineScore() + "\n" +
                "- Health Score: " + context.healthScore() + "\n" +
                "- Active Habits: " + context.activeHabits().stream().map(h -> h.name() + " (" + h.category() + ")").toList();

        try {
            String jsonOutput = llmClient.generateStructuredContent(systemInstruction, userPrompt);
            jsonOutput = cleanJsonText(jsonOutput);
            return objectMapper.readValue(jsonOutput, new TypeReference<List<HabitRecommendationResponse>>() {});
        } catch (Exception e) {
            log.error("Failed to generate AI habit recommendations, utilizing fallback: {}", e.getMessage());
            return getFallbackRecommendations(context.username());
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

    private List<HabitRecommendationResponse> getFallbackRecommendations(String username) {
        return List.of(
                new HabitRecommendationResponse(
                        "Drink 2L of Water",
                        "Health",
                        "EASY",
                        "Staying hydrated is essential for maintaining your discipline score and physical health.",
                        15
                ),
                new HabitRecommendationResponse(
                        "Read 10 Pages",
                        "Mindfulness",
                        "EASY",
                        "Reading daily helps expand your learning category and improves consistency.",
                        20
                ),
                new HabitRecommendationResponse(
                        "30-Minute Gym Workout",
                        "Fitness",
                        "MEDIUM",
                        "A solid workout raises your character's health score and builds mental fortitude.",
                        35
                )
        );
    }
}
