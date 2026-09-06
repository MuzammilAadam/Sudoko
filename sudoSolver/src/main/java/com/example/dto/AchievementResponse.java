package com.example.dto;

public class AchievementResponse {

    private String name;
    private String description;
    private int xpReward;
    private String rarity;

    public AchievementResponse(
            String name,
            String description,
            int xpReward,
            String rarity
    ) {
        this.name = name;
        this.description = description;
        this.xpReward = xpReward;
        this.rarity = rarity;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public int getXpReward() {
        return xpReward;
    }

    public String getRarity() {
        return rarity;
    }
}