package com.example.controller;

import com.example.dto.LeaderboardResponse;
import com.example.service.LeaderboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/leaderboard")
@CrossOrigin(origins = "http://localhost:5173")
public class LeaderboardController {

    private final LeaderboardService leaderboardService;

    public LeaderboardController(
            LeaderboardService leaderboardService
    ) {
        this.leaderboardService =
                leaderboardService;
    }

    @GetMapping
    public ResponseEntity<List<LeaderboardResponse>>
    getLeaderboard() {

        return ResponseEntity.ok(
                leaderboardService.getLeaderboard()
        );
    }
}