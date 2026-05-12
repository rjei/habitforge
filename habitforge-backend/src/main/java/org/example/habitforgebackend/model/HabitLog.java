package org.example.habitforgebackend.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "habit_logs")
public class HabitLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "habit_id", nullable = false)
    private Habit habit;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private int xpEarned;

    @Column(nullable = false)
    private LocalDateTime completedAt;

    public HabitLog() {
    }

    @PrePersist
    public void prePersist() {
        if (completedAt == null) completedAt = LocalDateTime.now();
    }

    public void setHabit(Habit habit) {
        this.habit = habit;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setXpEarned(int xpEarned) {
        this.xpEarned = xpEarned;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }

    public Long getId() {
        return id;
    }

    public int getXpEarned() {
        return xpEarned;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }
}

