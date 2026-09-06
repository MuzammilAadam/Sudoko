package com.example.controller;

import com.example.entity.User;
import com.example.model.Achievement;
import com.example.model.UserAchievement;
import com.example.repository.AchievementRepository;
import com.example.repository.UserAchievementRepository;
import com.example.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/achievements")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://127.0.0.1:5173", "http://127.0.0.1:5174"}, originPatterns = {"http://localhost:*", "http://127.0.0.1:*"})
public class AchievementController {

    private final UserAchievementRepository repository;
    private final AchievementRepository achievementRepository;
    private final UserRepository userRepository;

    public AchievementController(
            UserAchievementRepository repository,
            AchievementRepository achievementRepository,
            UserRepository userRepository
    ) {
        this.repository = repository;
        this.achievementRepository = achievementRepository;
        this.userRepository = userRepository;
    }

    /**
     * GET /api/achievements
     * Fetch all available achievement definitions in the game.
     */
    @GetMapping
    public List<Achievement> getAllAchievements() {
        return achievementRepository.findAll();
    }

    /**
     * GET /api/achievements/user/{userId}
     * Fetch unlocked achievements for a specific user ID.
     */
    @GetMapping("/user/{userId}")
    public List<UserAchievement> getUserAchievements(
            @PathVariable Long userId
    ) {
        return repository.findByUserId(userId);
    }

    /**
     * GET /api/achievements/me
     * Fetch unlocked achievements for the currently authenticated user.
     */
    @GetMapping("/me")
    public List<UserAchievement> getMyAchievements() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return List.of();
        }
        return repository.findByUserId(user.getId());
    }
}