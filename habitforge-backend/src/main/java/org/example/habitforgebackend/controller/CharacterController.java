package org.example.habitforgebackend.controller;

import org.example.habitforgebackend.dto.character.CharacterResponse;
import org.example.habitforgebackend.service.CharacterService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/character")
public class CharacterController {
    private final CharacterService characterService;

    public CharacterController(CharacterService characterService) {
        this.characterService = characterService;
    }

    @GetMapping
    public ResponseEntity<CharacterResponse> getMyCharacter(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(characterService.getMyCharacter(userDetails.getUsername()));
    }
}
