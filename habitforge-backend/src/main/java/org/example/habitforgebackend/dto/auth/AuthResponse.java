package org.example.habitforgebackend.dto.auth;

public record AuthResponse(
        String token,
        String tokenType,
        String username,
        String role
) {
}


