package org.example.habitforgebackend.config;

import org.example.habitforgebackend.model.Badge;
import org.example.habitforgebackend.model.BadgeRarity;
import org.example.habitforgebackend.model.XpBoost;
import org.example.habitforgebackend.repository.RewardRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RewardSeedConfig {

    @Bean
    CommandLineRunner seedRewards(RewardRepository rewardRepository) {
        return args -> {
            seedBadge(rewardRepository, "Rising Star", "Capai level 5", 5, 0, BadgeRarity.RARE);
            seedBadge(rewardRepository, "Habit Master", "Capai level 10", 10, 0, BadgeRarity.EPIC);
            seedBadge(rewardRepository, "Legend", "Capai level 20", 20, 0, BadgeRarity.LEGENDARY);
            seedBadge(rewardRepository, "One Week Warrior", "Streak 7 hari", 1, 7, BadgeRarity.COMMON);
            seedBadge(rewardRepository, "Monthly Master", "Streak 30 hari", 1, 30, BadgeRarity.RARE);
            seedBadge(rewardRepository, "Century Streak", "Streak 100 hari", 1, 100, BadgeRarity.LEGENDARY);
            seedXpBoost(rewardRepository, "Century XP Boost", "Boost XP 2x selama 24 jam", 1, 2.0, 24);
        };
    }

    private void seedBadge(RewardRepository repo, String name, String desc, int reqLevel, int reqStreak, BadgeRarity rarity) {
        if (repo.findByName(name).isPresent()) return;
        Badge badge = new Badge();
        badge.setName(name);
        badge.setDescription(desc);
        badge.setRequiredLevel(reqLevel);
        badge.setRequiredStreak(reqStreak);
        badge.setRarity(rarity);
        badge.setIconUrl("/badges/" + name.toLowerCase().replace(' ', '-') + ".png");
        repo.save(badge);
    }

    private void seedXpBoost(RewardRepository repo, String name, String desc, int reqLevel, double mult, int hours) {
        if (repo.findByName(name).isPresent()) return;
        XpBoost boost = new XpBoost();
        boost.setName(name);
        boost.setDescription(desc);
        boost.setRequiredLevel(reqLevel);
        boost.setMultiplier(mult);
        boost.setDurationHours(hours);
        repo.save(boost);
    }
}
