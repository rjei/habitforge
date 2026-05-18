package org.example.habitforgebackend.controller;

import org.example.habitforgebackend.dto.reward.RewardResponse;
import org.example.habitforgebackend.service.RewardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/rewards")
public class RewardController {
    private final RewardService rewardService;

    public RewardController(RewardService rewardService) {
        this.rewardService = rewardService;
    }

    @GetMapping
    public ResponseEntity<List<RewardResponse>> getMyRewards(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(rewardService.getMyRewards(userDetails.getUsername()));
    }
}
