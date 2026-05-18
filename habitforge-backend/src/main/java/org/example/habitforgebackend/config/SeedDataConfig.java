package org.example.habitforgebackend.config;

import org.example.habitforgebackend.model.User;
import org.example.habitforgebackend.repository.UserRepository;
import org.example.habitforgebackend.service.CharacterService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class SeedDataConfig {
    private final PasswordEncoder passwordEncoder;

    public SeedDataConfig(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    @Bean
    CommandLineRunner seedDemoUser(UserRepository userRepository, CharacterService characterService) {
        return args -> {
            if (userRepository.findByUsername("demo").isPresent()) return;
            User user = new User();
            user.setUsername("demo");
            user.setEmail("demo@local.dev");
            user.setPassword(passwordEncoder.encode("demo123"));
            user.setRole("USER");
            user = userRepository.save(user);
            characterService.getOrCreateForUser(user);
        };
    }
}

