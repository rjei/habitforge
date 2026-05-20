package org.example.habitforgebackend.dto.ai;

public record BurnoutCheckResponse(
    double burnoutScore,
    boolean isBurnoutRisk,
    String empatheticMessage,
    String recommendations
) {}
