package org.example.habitforgebackend.service;

import org.example.habitforgebackend.dto.ai.UserContextDto;
import org.example.habitforgebackend.model.DailyHabit;
import org.example.habitforgebackend.model.GameCharacter;
import org.example.habitforgebackend.model.Habit;
import org.example.habitforgebackend.model.User;
import org.example.habitforgebackend.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

class UserContextBuilderTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private GameCharacterRepository characterRepository;

    @Mock
    private HabitRepository habitRepository;

    @Mock
    private HabitLogRepository habitLogRepository;

    @Mock
    private MoodLogRepository moodLogRepository;

    @InjectMocks
    private UserContextBuilder userContextBuilder;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testBuildContextSuccess() {
        // Arrange
        User user = new User();
        user.setUsername("testuser");
        user.setEmail("test@example.com");

        GameCharacter character = new GameCharacter();
        character.setUser(user);
        character.setLevel(3);
        character.setTotalXp(120);

        Habit habit = new DailyHabit();
        habit.setName("Exercise");
        habit.setCategory("Fitness");
        habit.setXpReward(20);
        habit.setCurrentStreak(5);
        // Set creation date to 10 days ago so activeDays clamps to 7
        LocalDateTime tenDaysAgo = LocalDateTime.now().minusDays(10);
        // Since we can't directly set createdAt easily if prePersist is used, we can set it via reflection or use setter if available.
        // Let's check: Habit.java has getCreatedAt and prePersist, but wait, does it have a setter or constructor?
        // Wait, Habit.java has no setCreatedAt. But wait, it's field-based, so prePersist sets it if it's null.
        // We can just rely on the default prePersist or we can set it via reflection, or we can see if prePersist runs.
        // Wait! In Habit.java:
        // 46:     @PrePersist
        // 47:     public void prePersist() {
        // 48:         if (createdAt == null) createdAt = LocalDateTime.now();
        // 49:     }
        // Since we are mocking, we can use reflection to set the private field `createdAt`.
        // Let's set it using a reflection helper or simply write a small utility.
        // Or we can just set it. Wait, is there a way to set it? Let's check Habit.java. It has no setter for createdAt.
        // Let's use reflection to set `createdAt` in our test. It's very simple:
        try {
            java.lang.reflect.Field field = Habit.class.getDeclaredField("createdAt");
            field.setAccessible(true);
            field.set(habit, tenDaysAgo);
        } catch (Exception e) {
            fail(e);
        }

        List<Habit> habits = List.of(habit);

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(characterRepository.findByUser(user)).thenReturn(Optional.of(character));
        when(habitRepository.findByUserAndDeletedFalse(user)).thenReturn(habits);
        when(habitLogRepository.findByHabitIdAndUserIdOrderByCompletedAtDesc(any(), any())).thenReturn(new ArrayList<>());
        when(moodLogRepository.findByUserAndLoggedAtAfterOrderByLoggedAtDesc(any(), any())).thenReturn(new ArrayList<>());

        // Act
        UserContextDto context = userContextBuilder.buildContext("testuser");

        // Assert
        assertNotNull(context);
        assertEquals("testuser", context.username());
        assertEquals(3, context.level());
        assertEquals(120, context.totalXp());
        assertEquals(1, context.activeHabits().size());
        assertEquals("Exercise", context.activeHabits().get(0).name());
        assertEquals(0.0, context.weeklyCompletionRate()); // 0 completions
    }
}
