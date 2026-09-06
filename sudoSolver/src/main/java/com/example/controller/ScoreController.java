package com.example.controller;

import com.example.dto.ScoreRequest;
import com.example.dto.ScoreResponse;
import com.example.service.ScoreService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/scores")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://127.0.0.1:5173", "http://127.0.0.1:5174"}, originPatterns = {"http://localhost:*", "http://127.0.0.1:*"})
public class ScoreController {

    private final ScoreService scoreService;

    public ScoreController(
            ScoreService scoreService
    ) {
        this.scoreService = scoreService;
    }


    @PostMapping
    public ResponseEntity<ScoreResponse> saveScore(
            @RequestBody ScoreRequest request
    ) {

        ScoreResponse response =
                scoreService.saveScore(request);

        return new ResponseEntity<>(
                response,
                HttpStatus.CREATED
        );
    }


    @GetMapping("/me")
    public ResponseEntity<List<ScoreResponse>> getMyScores() {

        List<ScoreResponse> scores =
                scoreService.getMyScores();

        return ResponseEntity.ok(scores);
    }
}