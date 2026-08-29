package com.example.service;

import com.example.dto.ScoreRequest;
import com.example.dto.ScoreResponse;
import com.example.model.Difficulty;
import com.example.model.Score;
import com.example.entity.User;
import com.example.repository.ScoreRepository;
import com.example.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ScoreService {

    private final ScoreRepository scoreRepository;
    private final UserRepository userRepository;

    public ScoreService(
            ScoreRepository scoreRepository,
            UserRepository userRepository
    ) {
        this.scoreRepository = scoreRepository;
        this.userRepository = userRepository;
    }


    public ScoreResponse saveScore(ScoreRequest request) {

        // Get logged-in user
        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );


        // Calculate score
        int calculatedScore =
                calculateScore(
                        request.getDifficulty(),
                        request.getMistakes(),
                        request.getTimeTaken()
                );


        Score score = new Score();

        score.setUser(user);
        score.setDifficulty(request.getDifficulty());
        score.setMistakes(request.getMistakes());
        score.setTimeTaken(request.getTimeTaken());
        score.setScore(calculatedScore);


        Score savedScore =
                scoreRepository.save(score);


        return convertToResponse(savedScore);
    }


    private int calculateScore(
            Difficulty difficulty,
            int mistakes,
            long timeTaken
    ) {

        int baseScore;

        switch (difficulty) {

            case EASY:
                baseScore = 1000;
                break;

            case MEDIUM:
                baseScore = 2000;
                break;

            case HARD:
                baseScore = 3000;
                break;

            default:
                baseScore = 1000;
        }


        // Mistake penalty
        int mistakePenalty =
                mistakes * 200;


        // Time penalty
        int timePenalty =
                (int) (timeTaken / 10) * 10;


        int finalScore =
                baseScore
                        - mistakePenalty
                        - timePenalty;


        // Score cannot be negative
        return Math.max(finalScore, 0);
    }


    public List<ScoreResponse> getMyScores() {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );


        return scoreRepository
                .findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }


    private ScoreResponse convertToResponse(
            Score score
    ) {

        return new ScoreResponse(
                score.getId(),
                score.getUser().getUsername(),
                score.getScore(),
                score.getDifficulty(),
                score.getMistakes(),
                score.getTimeTaken()
        );
    }
}