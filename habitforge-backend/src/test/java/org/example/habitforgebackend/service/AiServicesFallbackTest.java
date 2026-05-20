package org.example.habitforgebackend.service;

import org.example.habitforgebackend.dto.ai.*;
import org.example.habitforgebackend.model.*;
import org.example.habitforgebackend.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDateTime;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

class AiServicesFallbackTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private ChatSessionRepository chatSessionRepository;
    @Mock
    private ChatMessageRepository chatMessageRepository;
    @Mock
    private MoodLogRepository moodLogRepository;
    @Mock
    private HabitRepository habitRepository;
    @Mock
    private HabitLogRepository habitLogRepository;
    private UserContextBuilder userContextBuilder;
    private PromptBuilder promptBuilder;
    @Mock
    private LlmClient llmClient;

    private AiCoachService aiCoachService;
    private AiRecommendationService aiRecommendationService;
    private AiBurnoutService aiBurnoutService;
    private AiDifficultyService aiDifficultyService;

    private User user;
    private UserContextDto contextDto;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        promptBuilder = new PromptBuilder();

        contextDto = new UserContextDto(
                "testuser",
                2,
                50,
                10,
                10,
                new ArrayList<>(),
                0.8,
                new ArrayList<>()
        );

        userContextBuilder = new StubUserContextBuilder(contextDto);

        aiCoachService = new AiCoachService(
                userRepository,
                chatSessionRepository,
                chatMessageRepository,
                moodLogRepository,
                userContextBuilder,
                promptBuilder,
                llmClient
        );

        aiRecommendationService = new AiRecommendationService(
                userContextBuilder,
                llmClient
        );

        aiBurnoutService = new AiBurnoutService(
                userRepository,
                habitRepository,
                habitLogRepository,
                userContextBuilder,
                llmClient
        );

        aiDifficultyService = new AiDifficultyService(
                userContextBuilder,
                llmClient
        );

        user = new User();
        setField(user, "id", 1L);
        user.setUsername("testuser");

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));

        // Force LLM Client to fail (to trigger fallbacks)
        when(llmClient.generateContent(any(), any())).thenThrow(new RuntimeException("API error"));
        when(llmClient.generateContentWithHistory(any(), any(), any())).thenThrow(new RuntimeException("API error"));
        when(llmClient.generateStructuredContent(any(), any())).thenThrow(new RuntimeException("API error"));
    }

    @Test
    void testAiCoachServiceFallback() {
        // Arrange
        ChatSession session = new ChatSession();
        session.setId(10L);
        session.setUser(user);
        session.setSessionTitle("Title");

        when(chatSessionRepository.save(any(ChatSession.class))).thenReturn(session);
        
        ChatMessage userMsg = new ChatMessage();
        userMsg.setContent("Hello");
        userMsg.setRole(ChatRole.USER);
        
        ChatMessage assistantMsg = new ChatMessage();
        assistantMsg.setId(100L);
        assistantMsg.setContent("Fallback reply");
        assistantMsg.setRole(ChatRole.ASSISTANT);
        assistantMsg.setSentAt(LocalDateTime.now());

        when(chatMessageRepository.save(any(ChatMessage.class))).thenAnswer(invocation -> {
            ChatMessage msg = invocation.getArgument(0);
            msg.setId(100L);
            return msg;
        });

        // Act
        ChatMessageResponse response = aiCoachService.sendMessageToCoach("testuser", new ChatRequest(null, "Hello Coach"));

        // Assert
        assertNotNull(response);
        assertEquals(10L, response.sessionId());
        assertTrue(response.content().contains("Feynman Technique"));
    }

    @Test
    void testAiRecommendationServiceFallback() {
        // Act
        List<HabitRecommendationResponse> recommendations = aiRecommendationService.getRecommendations("testuser");

        // Assert
        assertNotNull(recommendations);
        assertEquals(3, recommendations.size());
        assertEquals("Drink 2L of Water", recommendations.get(0).name());
        assertEquals("Health", recommendations.get(0).category());
    }

    @Test
    void testAiBurnoutServiceFallback() {
        // Arrange: active habit count alone contributes 0.3, below the risk threshold.
        List<Habit> activeHabits = new ArrayList<>();
        for (int i = 0; i < 9; i++) {
            DailyHabit habit = new DailyHabit();
            setField(habit, "id", (long) i);
            setField(habit, "createdAt", LocalDateTime.now().minusDays(20));
            habit.setCurrentStreak(0);
            activeHabits.add(habit);
        }
        when(habitRepository.findByUserAndDeletedFalse(user)).thenReturn(activeHabits);
        when(habitLogRepository.findByHabitIdAndUserIdOrderByCompletedAtDesc(any(), any())).thenReturn(new ArrayList<>());

        // Act
        BurnoutCheckResponse response = aiBurnoutService.checkBurnout("testuser");

        // Assert
        assertNotNull(response);
        assertFalse(response.isBurnoutRisk());
        assertEquals(0.3, response.burnoutScore()); // active habits > 8 adds 0.3

        // Add broken streaks to cross the burnout-risk threshold.
        HabitLog completedLog = new HabitLog();
        completedLog.setCompletedAt(LocalDateTime.now().minusDays(10));
        List<HabitLog> logs = List.of(completedLog);
        for (int i = 0; i < 3; i++) {
            when(habitLogRepository.findByHabitIdAndUserIdOrderByCompletedAtDesc(eq((long) i), any())).thenReturn(logs);
        }
        
        // Act again
        response = aiBurnoutService.checkBurnout("testuser");
        
        // Assert again
        assertNotNull(response);
        // Active habits > 8 (adds 0.3), broken streaks >= 3 (adds 0.3) -> score = 0.6 >= 0.5
        assertEquals(0.6, response.burnoutScore(), 0.001);
        assertTrue(response.isBurnoutRisk());
        assertTrue(response.empatheticMessage().contains("pushing yourself hard"));
        assertTrue(response.recommendations().contains("Consider pausing"));
    }

    @Test
    void testAiDifficultyServiceFallback() {
        // Arrange
        DifficultyPredictRequest request = new DifficultyPredictRequest(
                "Learn Spring Boot",
                "Learning",
                "DAILY",
                null,
                null
        );

        // Act
        DifficultyPredictResponse response = aiDifficultyService.predictDifficulty("testuser", request);

        // Assert
        assertNotNull(response);
        assertEquals("MEDIUM", response.difficulty());
        assertEquals(50, response.successChance());
        assertTrue(response.advice().contains("Start small"));
    }

    private void setField(Object target, String fieldName, Object value) {
        Class<?> current = target.getClass();
        while (current != null) {
            try {
                Field field = current.getDeclaredField(fieldName);
                field.setAccessible(true);
                field.set(target, value);
                return;
            } catch (NoSuchFieldException e) {
                current = current.getSuperclass();
            } catch (IllegalAccessException e) {
                throw new RuntimeException(e);
            }
        }
        throw new IllegalArgumentException("Field not found: " + fieldName);
    }

    private static class StubUserContextBuilder extends UserContextBuilder {
        private final UserContextDto context;

        StubUserContextBuilder(UserContextDto context) {
            super(null, null, null, null, null);
            this.context = context;
        }

        @Override
        public UserContextDto buildContext(String username) {
            return context;
        }
    }
}
