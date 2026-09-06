package com.example.config;

import com.example.model.Achievement;
import com.example.model.AchievementType;
import com.example.repository.AchievementRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AchievementInitializer {

    @Bean
    CommandLineRunner initializeAchievements(
            AchievementRepository repository
    ) {

        return args -> {

            for (AchievementType type : AchievementType.values()) {

                if (repository.findByCode(type.getCode()).isEmpty()) {

                    Achievement achievement =
                            new Achievement(
                                    type.getCode(),
                                    type.getName(),
                                    type.getDescription(),
                                    type.getXpReward(),
                                    type.getRarity()
                            );

                    repository.save(achievement);
                }
            }
        };
    }
}