package org.example.habitforgebackend.service;

import org.example.habitforgebackend.model.GameCharacter;
import org.example.habitforgebackend.model.Habit;
import org.example.habitforgebackend.repository.GameCharacterRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class XpService {
    private final GameCharacterRepository characterRepository;
    private final RewardService rewardService;

    public XpService(GameCharacterRepository characterRepository, RewardService rewardService) {
        this.characterRepository = characterRepository;
        this.rewardService = rewardService;
    }

    @Transactional
    public int addXp(GameCharacter character, int baseXp, Habit habit) {
        double multiplier = character.getEffectiveXpMultiplier();
        int xpEarned = (int) Math.round(baseXp * multiplier);

        character.setTotalXp(character.getTotalXp() + xpEarned);
        applyCategoryScore(character, habit, xpEarned);

        while (CharacterService.canLevelUp(character)) {
            character.setLevel(character.getLevel() + 1);
            rewardService.checkAndGrantLevelRewards(character);
        }

        characterRepository.save(character);
        return xpEarned;
    }

    private void applyCategoryScore(GameCharacter character, Habit habit, int xpEarned) {
        String category = habit.getCategory() == null ? "" : habit.getCategory().toLowerCase();
        if (category.contains("produktiv") || category.contains("belajar")) {
            character.setDisciplineScore(character.getDisciplineScore() + xpEarned);
        }
        if (category.contains("kesehatan") || category.contains("olahraga") || category.contains("health")) {
            character.setHealthScore(character.getHealthScore() + xpEarned);
        }
    }
}
