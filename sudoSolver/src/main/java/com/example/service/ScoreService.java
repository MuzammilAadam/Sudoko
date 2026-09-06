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
    private final AchievementService achievementService;

    public ScoreService(
            ScoreRepository scoreRepository,
            UserRepository userRepository,
            AchievementService achievementService
    ) {
        this.scoreRepository = scoreRepository;
        this.userRepository = userRepository;
        this.achievementService = achievementService;
    }


    private User getAuthenticatedUser() {
        Object principal = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        // BUG FIX / CORRECTION:
        // If principal is already the User entity instance, return it directly to avoid an extra DB query.
        if (principal instanceof User user) {
            return user;
        }

        // BUG FIX / CORRECTION:
        // Previously, JwtAuthenticationFilter placed the 'User' object as the principal.
        // Calling authentication.getName() evaluated user.toString(), returning "com.example.entity.User@<hashcode>".
        // Passing that string to findByEmail(...) resulted in Optional.empty() and threw "User not found".
        // Now authentication.getName() correctly yields the email address string.
        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        return userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );
    }


    public ScoreResponse saveScore(ScoreRequest request) {

        // Get logged-in user
        User user = getAuthenticatedUser();


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

        // Update user stats
        user.setGamesPlayed(user.getGamesPlayed() + 1);
        user.setGamesWon(user.getGamesWon() + 1);
        user.setTotalScore(user.getTotalScore() + calculatedScore);

        // Check and award achievements and XP
        java.util.List<com.example.model.Achievement> unlocked =
                achievementService.checkAchievements(
                        user,
                        request.getDifficulty().name(),
                        request.getMistakes(),
                        true
                );

        userRepository.save(user);

        java.util.List<com.example.dto.AchievementResponse> achievementResponses =
                unlocked.stream()
                        .map(a -> new com.example.dto.AchievementResponse(
                                a.getName(),
                                a.getDescription(),
                                a.getXpReward(),
                                a.getRarity()
                        ))
                        .toList();

        return new ScoreResponse(
                savedScore.getId(),
                savedScore.getUser().getUsername(),
                savedScore.getScore(),
                savedScore.getDifficulty(),
                savedScore.getMistakes(),
                savedScore.getTimeTaken(),
                user.getTotalXP(),
                user.getLevel(),
                achievementResponses
        );
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

            case EXPERT:
                baseScore = 4000;
                break;

            case MASTER:
                baseScore = 5000;
                break;

            case EXTREME:
                baseScore = 6000;
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

        // Get logged-in user
        User user = getAuthenticatedUser();


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
                score.getTimeTaken(),
                score.getUser() != null ? score.getUser().getTotalXP() : 0,
                score.getUser() != null ? score.getUser().getLevel() : 1,
                new java.util.ArrayList<>()
        );
    }
}