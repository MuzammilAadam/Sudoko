package com.example.model;

public enum AchievementType {

    FIRST_GAME(
            "FIRST_GAME",
            "First Step",
            "Complete your first Sudoku",
            50,
            "COMMON"
    ),

    FIRST_WIN(
            "FIRST_WIN",
            "First Victory",
            "Win your first Sudoku game",
            100,
            "COMMON"
    ),

    PERFECT_GAME(
            "PERFECT_GAME",
            "Perfect Solver",
            "Complete a Sudoku with zero mistakes",
            300,
            "RARE"
    ),

    HARD_SOLVER(
            "HARD_SOLVER",
            "Sharp Mind",
            "Complete a Hard Sudoku",
            400,
            "RARE"
    ),

    MASTER_SOLVER(
            "MASTER_SOLVER",
            "Master Solver",
            "Complete a Master Sudoku",
            700,
            "EPIC"
    ),

    EXTREME_SOLVER(
            "EXTREME_SOLVER",
            "Extreme Mind",
            "Complete an Extreme Sudoku",
            1000,
            "LEGENDARY"
    ),

    THREE_WIN_STREAK(
            "THREE_WIN_STREAK",
            "On Fire",
            "Win 3 games in a row",
            200,
            "RARE"
    ),

    MULTIPLAYER_FIRST_WIN(
            "MULTIPLAYER_FIRST_WIN",
            "Arena Winner",
            "Win your first multiplayer game",
            250,
            "RARE"
    );

    private final String code;
    private final String name;
    private final String description;
    private final int xpReward;
    private final String rarity;

    AchievementType(
            String code,
            String name,
            String description,
            int xpReward,
            String rarity
    ) {
        this.code = code;
        this.name = name;
        this.description = description;
        this.xpReward = xpReward;
        this.rarity = rarity;
    }

    public String getCode() {
        return code;
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