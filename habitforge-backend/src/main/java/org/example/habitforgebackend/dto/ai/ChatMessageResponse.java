package org.example.habitforgebackend.dto.ai;

import java.time.LocalDateTime;

public record ChatMessageResponse(
    Long messageId,
    Long sessionId,
    String sessionTitle,
    String role,
    String content,
    LocalDateTime sentAt
) {}
