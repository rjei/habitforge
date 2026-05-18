package org.example.habitforgebackend.repository;

import org.example.habitforgebackend.model.GameCharacter;
import org.example.habitforgebackend.model.User;

import java.util.Optional;

public interface GameCharacterRepository extends org.springframework.data.jpa.repository.JpaRepository<GameCharacter, Long> {
    Optional<GameCharacter> findByUser(User user);
    Optional<GameCharacter> findByUserId(Long userId);
}
