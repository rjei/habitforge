package org.example.habitforgebackend.controller;

import jakarta.validation.Valid;
import org.example.habitforgebackend.dto.habit.HabitCreateRequest;
import org.example.habitforgebackend.dto.habit.HabitLogResponse;
import org.example.habitforgebackend.dto.habit.HabitResponse;
import org.example.habitforgebackend.dto.habit.HabitUpdateRequest;
import org.example.habitforgebackend.service.HabitService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/habits")
public class HabitController {
    private final HabitService habitService;

    public HabitController(HabitService habitService) {
        this.habitService = habitService;
    }

    @PostMapping
    public ResponseEntity<HabitResponse> createHabit(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody HabitCreateRequest request
    ) {
        return ResponseEntity.ok(habitService.createHabit(userDetails.getUsername(), request));
    }

    @GetMapping
    public ResponseEntity<List<HabitResponse>> getMyHabits(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(habitService.getHabits(userDetails.getUsername()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<HabitResponse> getHabitById(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(habitService.getHabitById(userDetails.getUsername(), id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<HabitResponse> updateHabit(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @Valid @RequestBody HabitUpdateRequest request
    ) {
        return ResponseEntity.ok(habitService.updateHabit(userDetails.getUsername(), id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHabit(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id
    ) {
        habitService.deleteHabit(userDetails.getUsername(), id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<HabitResponse> completeHabit(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(habitService.completeHabit(userDetails.getUsername(), id));
    }

    @GetMapping("/{id}/logs")
    public ResponseEntity<List<HabitLogResponse>> getHabitLogs(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(habitService.getHabitLogs(userDetails.getUsername(), id));
    }
}

