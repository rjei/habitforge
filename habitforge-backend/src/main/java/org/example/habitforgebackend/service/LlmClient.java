package org.example.habitforgebackend.service;

import org.example.habitforgebackend.model.ChatMessage;

import java.util.List;

public interface LlmClient {
    String generateContent(String systemInstruction, String userPrompt);

    String generateContentWithHistory(String systemInstruction, List<ChatMessage> history, String userPrompt);

    String generateStructuredContent(String systemInstruction, String userPrompt);
}
