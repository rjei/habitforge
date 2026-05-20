package org.example.habitforgebackend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "mood_logs")
public class MoodLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private int moodScore;

    @Column(length = 500)
    private String note;

    @Column(nullable = false)
    private LocalDateTime loggedAt;

    public MoodLog() {
    }

    @PrePersist
    public void prePersist() {
        if (loggedAt == null) loggedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public int getMoodScore() {
        return moodScore;
    }

    public void setMoodScore(int moodScore) {
        this.moodScore = moodScore;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public LocalDateTime getLoggedAt() {
        return loggedAt;
    }

    public void setLoggedAt(LocalDateTime loggedAt) {
        this.loggedAt = loggedAt;
    }
}
