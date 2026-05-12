package org.example.habitforgebackend.model;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

import java.time.LocalDate;

@Entity
@DiscriminatorValue("CHALLENGE")
public class ChallengeHabit extends Habit {
    @Column
    private LocalDate deadline;

    public LocalDate getDeadline() {
        return deadline;
    }

    public void setDeadline(LocalDate deadline) {
        this.deadline = deadline;
    }

    @Override
    public double calculateXp() {
        return (deadline != null && LocalDate.now().isAfter(deadline)) ? getXpReward() : getXpReward() * 2.0;
    }

    @Override
    public boolean isCompletionValid(LocalDate date) {
        return deadline == null || !date.isAfter(deadline);
    }
}

