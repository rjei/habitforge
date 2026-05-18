package org.example.habitforgebackend.model;

import jakarta.persistence.*;

@Entity
@DiscriminatorValue("XP_BOOST")
public class XpBoost extends Reward {
    @Column
    private Double multiplier = 2.0;

    @Column
    private Integer durationHours = 24;

    public XpBoost() {
    }

    @Override
    public void applyReward(GameCharacter character) {
        double mult = multiplier != null ? multiplier : 2.0;
        int hours = durationHours != null ? durationHours : 24;
        character.activateBoost(mult, hours);
    }

    @Override
    public boolean isEligible(GameCharacter character) {
        return character.getLevel() >= getRequiredLevel();
    }

    public double getMultiplier() {
        return multiplier != null ? multiplier : 2.0;
    }

    public void setMultiplier(double multiplier) {
        this.multiplier = multiplier;
    }

    public int getDurationHours() {
        return durationHours != null ? durationHours : 24;
    }

    public void setDurationHours(int durationHours) {
        this.durationHours = durationHours;
    }
}
