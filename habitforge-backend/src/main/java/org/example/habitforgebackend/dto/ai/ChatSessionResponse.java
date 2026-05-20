package org.example.habitforgebackend.dto.ai;

import java.time.LocalDateTime;

public record ChatSessionResponse(
    Long id,
    String sessionTitle,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}
