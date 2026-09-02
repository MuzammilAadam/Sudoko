package com.example.model;

import java.util.HashMap;
import java.util.Map;

public class MultiplayerGame {

    private String roomId;

    // Current board visible to both players
    private int[][] board;

    // Original solution used for validation
    private int[][] solution;

    // Players and their scores
    private Map<String, Integer> playerScores = new HashMap<>();

    private boolean gameFinished = false;

    public MultiplayerGame(
            String roomId,
            int[][] board,
            int[][] solution
    ) {
        this.roomId = roomId;
        this.board = board;
        this.solution = solution;
    }

    public String getRoomId() {
        return roomId;
    }

    public int[][] getBoard() {
        return board;
    }

    public void setBoard(int[][] board) {
        this.board = board;
    }

    public int[][] getSolution() {
        return solution;
    }

    public void setSolution(int[][] solution) {
        this.solution = solution;
    }

    public Map<String, Integer> getPlayerScores() {
        return playerScores;
    }

    public boolean isGameFinished() {
        return gameFinished;
    }

    public void setGameFinished(boolean gameFinished) {
        this.gameFinished = gameFinished;
    }
}