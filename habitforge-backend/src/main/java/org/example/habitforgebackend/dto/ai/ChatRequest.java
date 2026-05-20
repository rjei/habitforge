package org.example.habitforgebackend.dto.ai;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ChatRequest(
    Long sessionId,
    
    @NotBlank(message = "Message content cannot be blank")
    @Size(max = 2000, message = "Message must not exceed 2000 characters")
    String message
) {}
