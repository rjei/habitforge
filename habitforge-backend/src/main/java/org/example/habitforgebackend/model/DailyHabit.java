package org.example.habitforgebackend.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

import java.time.LocalDate;

@Entity
@DiscriminatorValue("DAILY")
public class DailyHabit extends Habit {
    @Override
    public double calculateXp() {
        if (getCurrentStreak() >= 100) return getXpReward() * 3.0;
        if (getCurrentStreak() >= 30) return getXpReward() * 2.0;
        if (getCurrentStreak() >= 7) return getXpReward() * 1.5;
        return getXpReward();
    }

    @Override
    public boolean isCompletionValid(LocalDate date) {
        return true;
    }
}

