package com.example.dto;

public class MoveResponse {

    private boolean valid;
    private String message;
    private int[][] board;
    private int mistakes;
    private int remainingChances;
    private boolean gameOver;
    private boolean completed;

    public MoveResponse(
            boolean valid,
            String message,
            int[][] board,
            int mistakes,
            int remainingChances,
            boolean gameOver,
            boolean completed) {

        this.valid = valid;
        this.message = message;
        this.board = board;
        this.mistakes = mistakes;
        this.remainingChances = remainingChances;
        this.gameOver = gameOver;
        this.completed = completed;
    }

    public boolean isValid() {
        return valid;
    }

    public String getMessage() {
        return message;
    }

    public int[][] getBoard() {
        return board;
    }

    public int getMistakes() {
        return mistakes;
    }

    public int getRemainingChances() {
        return remainingChances;
    }

    public boolean isGameOver() {
        return gameOver;
    }

    public boolean isCompleted() {
        return completed;
    }
}