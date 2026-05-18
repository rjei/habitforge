package org.example.habitforgebackend.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "characters")
public class GameCharacter {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false)
    private int level = 1;

    @Column(nullable = false)
    private int totalXp = 0;

    @Column(nullable = false)
    private int disciplineScore = 0;

    @Column(nullable = false)
    private int healthScore = 0;

    @Column
    private Double activeXpMultiplier;

    @Column
    private LocalDateTime xpBoostExpiresAt;

    public GameCharacter() {
    }

    public static GameCharacter forUser(User user) {
        GameCharacter character = new GameCharacter();
        character.setUser(user);
        return character;
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public int getLevel() {
        return level;
    }

    public void setLevel(int level) {
        this.level = level;
    }

    public int getTotalXp() {
        return totalXp;
    }

    public void setTotalXp(int totalXp) {
        this.totalXp = totalXp;
    }

    public int getDisciplineScore() {
        return disciplineScore;
    }

    public void setDisciplineScore(int disciplineScore) {
        this.disciplineScore = disciplineScore;
    }

    public int getHealthScore() {
        return healthScore;
    }

    public void setHealthScore(int healthScore) {
        this.healthScore = healthScore;
    }

    public Double getActiveXpMultiplier() {
        return activeXpMultiplier;
    }

    public void setActiveXpMultiplier(Double activeXpMultiplier) {
        this.activeXpMultiplier = activeXpMultiplier;
    }

    public LocalDateTime getXpBoostExpiresAt() {
        return xpBoostExpiresAt;
    }

    public void setXpBoostExpiresAt(LocalDateTime xpBoostExpiresAt) {
        this.xpBoostExpiresAt = xpBoostExpiresAt;
    }

    public void activateBoost(double multiplier, int durationHours) {
        this.activeXpMultiplier = multiplier;
        this.xpBoostExpiresAt = LocalDateTime.now().plusHours(durationHours);
    }

    public double getEffectiveXpMultiplier() {
        if (activeXpMultiplier == null || xpBoostExpiresAt == null) {
            return 1.0;
        }
        if (LocalDateTime.now().isAfter(xpBoostExpiresAt)) {
            return 1.0;
        }
        return activeXpMultiplier;
    }
}
