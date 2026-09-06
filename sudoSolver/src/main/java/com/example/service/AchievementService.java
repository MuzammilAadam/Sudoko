package com.example.service;

import com.example.model.*;
import com.example.entity.User;
import com.example.repository.AchievementRepository;
import com.example.repository.UserAchievementRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AchievementService {

    private final AchievementRepository achievementRepository;
    private final UserAchievementRepository userAchievementRepository;

    public AchievementService(
            AchievementRepository achievementRepository,
            UserAchievementRepository userAchievementRepository
    ) {
        this.achievementRepository = achievementRepository;
        this.userAchievementRepository = userAchievementRepository;
    }

    public List<Achievement> checkAchievements(
            User user,
            String difficulty,
            int mistakes,
            boolean won
    ) {

        List<Achievement> unlocked = new ArrayList<>();

        // First game
        if (user.getGamesPlayed() == 1) {

            unlock(
                    user,
                    AchievementType.FIRST_GAME,
                    unlocked
            );
        }

        // First win
        if (won && user.getGamesWon() == 1) {

            unlock(
                    user,
                    AchievementType.FIRST_WIN,
                    unlocked
            );
        }

        // Perfect game
        if (won && mistakes == 0) {

            unlock(
                    user,
                    AchievementType.PERFECT_GAME,
                    unlocked
            );
        }

        // Hard
        if (won && difficulty.equalsIgnoreCase("HARD")) {

            unlock(
                    user,
                    AchievementType.HARD_SOLVER,
                    unlocked
            );
        }

        // Master
        if (won && difficulty.equalsIgnoreCase("MASTER")) {

            unlock(
                    user,
                    AchievementType.MASTER_SOLVER,
                    unlocked
            );
        }

        // Extreme
        if (won && difficulty.equalsIgnoreCase("EXTREME")) {

            unlock(
                    user,
                    AchievementType.EXTREME_SOLVER,
                    unlocked
            );
        }

        return unlocked;
    }

    private void unlock(
            User user,
            AchievementType type,
            List<Achievement> unlocked
    ) {

        Achievement achievement =
                achievementRepository
                        .findByCode(type.getCode())
                        .orElseThrow();

        boolean alreadyUnlocked =
                userAchievementRepository
                        .existsByUserIdAndAchievementId(
                                user.getId(),
                                achievement.getId()
                        );

        if (alreadyUnlocked) {
            return;
        }

        UserAchievement userAchievement =
                new UserAchievement(
                        user,
                        achievement
                );

        userAchievementRepository.save(userAchievement);

        // Give XP
        int newXP =
                user.getTotalXP()
                        + achievement.getXpReward();

        user.setTotalXP(newXP);

        // Calculate level
        int newLevel =
                (newXP / 500) + 1;

        user.setLevel(newLevel);

        unlocked.add(achievement);
    }
}