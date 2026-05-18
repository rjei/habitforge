package org.example.habitforgebackend.service;

import org.example.habitforgebackend.dto.character.CharacterResponse;
import org.example.habitforgebackend.model.GameCharacter;
import org.example.habitforgebackend.model.User;
import org.example.habitforgebackend.repository.GameCharacterRepository;
import org.example.habitforgebackend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CharacterService {
    private final GameCharacterRepository characterRepository;
    private final UserRepository userRepository;

    public CharacterService(GameCharacterRepository characterRepository, UserRepository userRepository) {
        this.characterRepository = characterRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public GameCharacter getOrCreateForUser(User user) {
        return characterRepository.findByUser(user)
                .orElseGet(() -> characterRepository.save(GameCharacter.forUser(user)));
    }

    @Transactional(readOnly = true)
    public CharacterResponse getMyCharacter(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        GameCharacter character = characterRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Character not found"));
        return toResponse(character);
    }

    public static int xpToNextLevel(int level) {
        return level * 100;
    }

    public static int xpProgressInCurrentLevel(int totalXp, int level) {
        int threshold = cumulativeXpForLevel(level);
        return totalXp - threshold;
    }

    public static int cumulativeXpForLevel(int level) {
        int sum = 0;
        for (int i = 1; i < level; i++) {
            sum += i * 100;
        }
        return sum;
    }

    public static boolean canLevelUp(GameCharacter character) {
        int nextThreshold = cumulativeXpForLevel(character.getLevel() + 1);
        return character.getTotalXp() >= nextThreshold;
    }

    private CharacterResponse toResponse(GameCharacter character) {
        int xpNeeded = xpToNextLevel(character.getLevel());
        int progress = xpProgressInCurrentLevel(character.getTotalXp(), character.getLevel());
        int remaining = Math.max(0, xpNeeded - progress);

        return new CharacterResponse(
                character.getId(),
                character.getLevel(),
                character.getTotalXp(),
                remaining,
                character.getDisciplineScore(),
                character.getHealthScore(),
                character.getActiveXpMultiplier(),
                character.getXpBoostExpiresAt()
        );
    }
}
