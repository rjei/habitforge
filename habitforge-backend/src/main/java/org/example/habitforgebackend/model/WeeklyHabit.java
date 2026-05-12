package org.example.habitforgebackend.model;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

import java.time.LocalDate;

@Entity
@DiscriminatorValue("WEEKLY")
public class WeeklyHabit extends Habit {
    @Column(nullable = false)
    private int targetDaysPerWeek = 3;

    public int getTargetDaysPerWeek() {
        return targetDaysPerWeek;
    }

    public void setTargetDaysPerWeek(int targetDaysPerWeek) {
        this.targetDaysPerWeek = targetDaysPerWeek;
    }

    @Override
    public double calculateXp() {
        return getXpReward() * 1.2;
    }

    @Override
    public boolean isCompletionValid(LocalDate date) {
        return true;
    }
}

