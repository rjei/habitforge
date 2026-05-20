package org.example.habitforgebackend.service;

import org.example.habitforgebackend.dto.ai.gemini.GeminiRequest;
import org.example.habitforgebackend.dto.ai.gemini.GeminiResponse;
import org.example.habitforgebackend.model.ChatMessage;
import org.example.habitforgebackend.model.ChatRole;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.ArrayList;
import java.util.List;

@Component
public class GeminiClient implements LlmClient {

    private static final Logger log = LoggerFactory.getLogger(GeminiClient.class);
    private static final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=";

    private final RestClient restClient;

    @Value("${gemini.api.key}")
    private String apiKey;

    public GeminiClient() {
        this.restClient = RestClient.builder().build();
    }

    private void validateApiKey() {
        if (apiKey == null || apiKey.trim().isEmpty() || apiKey.contains("${GEMINI_API_KEY}")) {
            throw new IllegalStateException("Gemini API key is not configured or is using default placeholder");
        }
    }

    private String executePost(GeminiRequest request) {
        validateApiKey();
        String url = GEMINI_API_URL + apiKey;

        try {
            GeminiResponse response = restClient.post()
                    .uri(url)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(request)
                    .retrieve()
                    .body(GeminiResponse.class);

            if (response != null && response.candidates() != null && !response.candidates().isEmpty()) {
                var content = response.candidates().get(0).content();
                if (content != null && content.parts() != null && !content.parts().isEmpty()) {
                    return content.parts().get(0).text();
                }
            }
            throw new RuntimeException("Gemini response is empty or malformed");
        } catch (Exception e) {
            log.error("Error calling Gemini API: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to generate content from AI provider: " + e.getMessage(), e);
        }
    }

    @Override
    public String generateContent(String systemInstruction, String userPrompt) {
        GeminiRequest.Part systemPart = new GeminiRequest.Part(systemInstruction);
        GeminiRequest.SystemInstruction sysInstruction = new GeminiRequest.SystemInstruction(List.of(systemPart));

        GeminiRequest.Part userPart = new GeminiRequest.Part(userPrompt);
        GeminiRequest.Content userContent = new GeminiRequest.Content("user", List.of(userPart));

        GeminiRequest request = new GeminiRequest(
                List.of(userContent),
                sysInstruction,
                null
        );

        return executePost(request);
    }

    @Override
    public String generateContentWithHistory(String systemInstruction, List<ChatMessage> history, String userPrompt) {
        GeminiRequest.Part systemPart = new GeminiRequest.Part(systemInstruction);
        GeminiRequest.SystemInstruction sysInstruction = new GeminiRequest.SystemInstruction(List.of(systemPart));

        List<GeminiRequest.Content> contents = new ArrayList<>();
        for (ChatMessage msg : history) {
            String role = msg.getRole() == ChatRole.USER ? "user" : "model";
            contents.add(new GeminiRequest.Content(role, List.of(new GeminiRequest.Part(msg.getContent()))));
        }
        contents.add(new GeminiRequest.Content("user", List.of(new GeminiRequest.Part(userPrompt))));

        GeminiRequest request = new GeminiRequest(
                contents,
                sysInstruction,
                null
        );

        return executePost(request);
    }

    @Override
    public String generateStructuredContent(String systemInstruction, String userPrompt) {
        GeminiRequest.Part systemPart = new GeminiRequest.Part(systemInstruction);
        GeminiRequest.SystemInstruction sysInstruction = new GeminiRequest.SystemInstruction(List.of(systemPart));

        GeminiRequest.Part userPart = new GeminiRequest.Part(userPrompt);
        GeminiRequest.Content userContent = new GeminiRequest.Content("user", List.of(userPart));

        GeminiRequest.GenerationConfig config = new GeminiRequest.GenerationConfig("application/json");

        GeminiRequest request = new GeminiRequest(
                List.of(userContent),
                sysInstruction,
                config
        );

        return executePost(request);
    }
}
