package com.example.dto;

import com.example.model.Difficulty;

public class ScoreResponse {

    private Long id;
    private String username;
    private int score;
    private Difficulty difficulty;
    private int mistakes;
    private long timeTaken;

    public ScoreResponse(
            Long id,
            String username,
            int score,
            Difficulty difficulty,
            int mistakes,
            long timeTaken
    ) {
        this.id = id;
        this.username = username;
        this.score = score;
        this.difficulty = difficulty;
        this.mistakes = mistakes;
        this.timeTaken = timeTaken;
    }

    public Long getId() {
        return id;
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