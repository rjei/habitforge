package org.example.habitforgebackend.controller;

import jakarta.validation.Valid;
import org.example.habitforgebackend.dto.auth.AuthResponse;
import org.example.habitforgebackend.dto.auth.LoginRequest;
import org.example.habitforgebackend.dto.auth.RegisterRequest;
import org.example.habitforgebackend.service.AuthService;
import org.example.habitforgebackend.repository.UserRepository;
import org.example.habitforgebackend.repository.GameCharacterRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;
    private final UserRepository userRepository;
    private final GameCharacterRepository characterRepository;

    public AuthController(AuthService authService, UserRepository userRepository, GameCharacterRepository characterRepository) {
        this.authService = authService;
        this.userRepository = userRepository;
        this.characterRepository = characterRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserInfo>> getRegisteredUsers() {
        List<UserInfo> users = userRepository.findAll().stream()
                .map(u -> {
                    int lvl = 1;
                    int xp = 0;
                    var charOpt = characterRepository.findByUserId(u.getId());
                    if (charOpt.isPresent()) {
                        lvl = charOpt.get().getLevel();
                        xp = charOpt.get().getTotalXp();
                    }
                    return new UserInfo(u.getId(), u.getUsername(), u.getEmail(), u.getRole(), lvl, xp);
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    public record UserInfo(Long id, String username, String email, String role, int level, int xp) {}
}



