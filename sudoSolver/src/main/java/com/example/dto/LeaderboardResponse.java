package com.example.dto;

import com.example.model.Difficulty;

public class LeaderboardResponse {

    private int rank;
    private String username;
    private int score;
    private Difficulty difficulty;
    private int mistakes;
    private long timeTaken;

    public LeaderboardResponse(
            int rank,
            String username,
            int score,
            Difficulty difficulty,
            int mistakes,
            long timeTaken
    ) {
        this.rank = rank;
        this.username = username;
        this.score = score;
        this.difficulty = difficulty;
        this.mistakes = mistakes;
        this.timeTaken = timeTaken;
    }

    public int getRank() {
        return rank;
    }

    public String getUsername() {
        return username;
    }

    public int getScore() {
        return score;
    }

    public Difficulty getDifficulty() {
        return difficulty;
    }

    public int getMistakes() {
        return mistakes;
    }

    public long getTimeTaken() {
        return timeTaken;
    }
}