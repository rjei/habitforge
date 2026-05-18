package org.example.habitforgebackend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "rewards")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "reward_type")
public abstract class Reward {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 255)
    private String description;

    @Column(nullable = false)
    private int requiredLevel;

    @Enumerated(EnumType.STRING)
    @Column(name = "reward_type", insertable = false, updatable = false)
    private RewardType rewardType;

    public Reward() {
    }

    public abstract void applyReward(GameCharacter character);

    public abstract boolean isEligible(GameCharacter character);

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getRequiredLevel() {
        return requiredLevel;
    }

    public void setRequiredLevel(int requiredLevel) {
        this.requiredLevel = requiredLevel;
    }

    public RewardType getRewardType() {
        return rewardType;
    }
}
