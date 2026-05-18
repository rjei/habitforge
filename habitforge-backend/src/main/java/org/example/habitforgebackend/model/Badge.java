package org.example.habitforgebackend.model;

import jakarta.persistence.*;

@Entity
@DiscriminatorValue("BADGE")
public class Badge extends Reward {
    @Column(length = 255)
    private String iconUrl;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private BadgeRarity rarity = BadgeRarity.COMMON;

    @Column
    private Integer requiredStreak = 0;

    public Badge() {
    }

    @Override
    public void applyReward(GameCharacter character) {
        // Badge ownership is tracked via UserReward
    }

    @Override
    public boolean isEligible(GameCharacter character) {
        return character.getLevel() >= getRequiredLevel();
    }

    public String getIconUrl() {
        return iconUrl;
    }

    public void setIconUrl(String iconUrl) {
        this.iconUrl = iconUrl;
    }

    public BadgeRarity getRarity() {
        return rarity;
    }

    public void setRarity(BadgeRarity rarity) {
        this.rarity = rarity;
    }

    public int getRequiredStreak() {
        return requiredStreak != null ? requiredStreak : 0;
    }

    public void setRequiredStreak(int requiredStreak) {
        this.requiredStreak = requiredStreak;
    }
}
