package org.example.habitforgebackend.dto.ai.gemini;

import java.util.List;

public record GeminiResponse(
    List<Candidate> candidates,
    UsageMetadata usageMetadata
) {
    public record Candidate(Content content, String finishReason) {}
    public record Content(List<Part> parts, String role) {}
    public record Part(String text) {}
    public record UsageMetadata(int promptTokenCount, int candidatesTokenCount, int totalTokenCount) {}
}
