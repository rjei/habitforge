package org.example.habitforgebackend.controller;

import jakarta.validation.Valid;
import org.example.habitforgebackend.dto.ai.*;
import org.example.habitforgebackend.service.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final AiCoachService aiCoachService;
    private final AiRecommendationService aiRecommendationService;
    private final AiBurnoutService aiBurnoutService;
    private final AiDifficultyService aiDifficultyService;

    public AiController(
            AiCoachService aiCoachService,
            AiRecommendationService aiRecommendationService,
            AiBurnoutService aiBurnoutService,
            AiDifficultyService aiDifficultyService
    ) {
        this.aiCoachService = aiCoachService;
        this.aiRecommendationService = aiRecommendationService;
        this.aiBurnoutService = aiBurnoutService;
        this.aiDifficultyService = aiDifficultyService;
    }

    @PostMapping("/coach/chat")
    public ResponseEntity<ChatMessageResponse> chatWithCoach(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ChatRequest request
    ) {
        return ResponseEntity.ok(aiCoachService.sendMessageToCoach(userDetails.getUsername(), request));
    }

    @GetMapping("/coach/sessions")
    public ResponseEntity<List<ChatSessionResponse>> getCoachSessions(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(aiCoachService.getUserSessions(userDetails.getUsername()));
    }

    @GetMapping("/coach/sessions/{id}/messages")
    public ResponseEntity<List<ChatMessageResponse>> getSessionMessages(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(aiCoachService.getSessionMessages(userDetails.getUsername(), id));
    }

    @PostMapping("/mood")
    public ResponseEntity<MoodResponse> logMood(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody MoodCreateRequest request
    ) {
        return ResponseEntity.ok(aiCoachService.logMood(userDetails.getUsername(), request));
    }

    @GetMapping("/recommendations")
    public ResponseEntity<List<HabitRecommendationResponse>> getRecommendations(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(aiRecommendationService.getRecommendations(userDetails.getUsername()));
    }

    @GetMapping("/burnout-check")
    public ResponseEntity<BurnoutCheckResponse> checkBurnout(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(aiBurnoutService.checkBurnout(userDetails.getUsername()));
    }

    @PostMapping("/predict-difficulty")
    public ResponseEntity<DifficultyPredictResponse> predictDifficulty(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody DifficultyPredictRequest request
    ) {
        return ResponseEntity.ok(aiDifficultyService.predictDifficulty(userDetails.getUsername(), request));
    }
}
