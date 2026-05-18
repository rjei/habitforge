package org.example.habitforgebackend.service;

import org.example.habitforgebackend.model.GameCharacter;
import org.example.habitforgebackend.model.Habit;
import org.springframework.stereotype.Service;

@Service
public class StreakService {
    private final RewardService rewardService;

    public StreakService(RewardService rewardService) {
        this.rewardService = rewardService;
    }

    public void onStreakUpdated(Habit habit, GameCharacter character) {
        int streak = habit.getCurrentStreak();
        rewardService.checkAndGrantStreakRewards(character, streak);
    }

    public static double getStreakMultiplier(int streak) {
        if (streak >= 100) return 3.0;
        if (streak >= 30) return 2.0;
        if (streak >= 7) return 1.5;
        return 1.0;
    }
}
