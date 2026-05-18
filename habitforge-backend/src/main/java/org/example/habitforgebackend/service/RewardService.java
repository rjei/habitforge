package org.example.habitforgebackend.service;

import org.example.habitforgebackend.dto.reward.RewardResponse;
import org.example.habitforgebackend.model.*;
import org.example.habitforgebackend.repository.RewardRepository;
import org.example.habitforgebackend.repository.UserRepository;
import org.example.habitforgebackend.repository.UserRewardRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class RewardService {
    private final RewardRepository rewardRepository;
    private final UserRewardRepository userRewardRepository;
    private final UserRepository userRepository;

    public RewardService(
            RewardRepository rewardRepository,
            UserRewardRepository userRewardRepository,
            UserRepository userRepository
    ) {
        this.rewardRepository = rewardRepository;
        this.userRewardRepository = userRewardRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<RewardResponse> getMyRewards(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return userRewardRepository.findByUserOrderByEarnedAtDesc(user).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public void checkAndGrantLevelRewards(GameCharacter character) {
        int level = character.getLevel();
        grantIfNotOwned(character, "Rising Star", level >= 5);
        grantIfNotOwned(character, "Habit Master", level >= 10);
        grantIfNotOwned(character, "Legend", level >= 20);
    }

    @Transactional
    public void checkAndGrantStreakRewards(GameCharacter character, int streak) {
        grantIfNotOwned(character, "One Week Warrior", streak >= 7);
        grantIfNotOwned(character, "Monthly Master", streak >= 30);
        if (streak >= 100) {
            grantIfNotOwned(character, "Century Streak", true);
            grantIfNotOwned(character, "Century XP Boost", true);
        }
    }

    private void grantIfNotOwned(GameCharacter character, String rewardName, boolean eligible) {
        if (!eligible) return;

        Reward reward = rewardRepository.findByName(rewardName).orElse(null);
        if (reward == null) return;

        User user = character.getUser();
        if (userRewardRepository.existsByUserIdAndRewardId(user.getId(), reward.getId())) {
            return;
        }

        if (reward.isEligible(character)) {
            reward.applyReward(character);

            UserReward userReward = new UserReward();
            userReward.setUser(user);
            userReward.setReward(reward);
            userRewardRepository.save(userReward);
        }
    }

    private RewardResponse toResponse(UserReward userReward) {
        Reward reward = userReward.getReward();
        String rarity = null;
        String iconUrl = null;
        if (reward instanceof Badge badge) {
            rarity = badge.getRarity() != null ? badge.getRarity().name() : null;
            iconUrl = badge.getIconUrl();
        }
        return new RewardResponse(
                reward.getId(),
                reward.getName(),
                reward.getDescription(),
                reward.getRewardType() != null ? reward.getRewardType().name() : null,
                rarity,
                iconUrl,
                userReward.getEarnedAt()
        );
    }
}
