package com.example.model;

public class Game {

    private String gameId;

    private int[][] puzzle;

    private int[][] currentBoard;

    private int mistakes;

    private int remainingChances;

    private GameStatus status;

    public Game(
            String gameId,
            int[][] puzzle,
            int[][] currentBoard) {

        this.gameId = gameId;
        this.puzzle = puzzle;
        this.currentBoard = currentBoard;

        this.mistakes = 0;
        this.remainingChances = 3;
        this.status = GameStatus.ACTIVE;
    }

    public String getGameId() {
        return gameId;
    }

    public int[][] getPuzzle() {
        return puzzle;
    }

    public int[][] getCurrentBoard() {
        return currentBoard;
    }

    public void setCurrentBoard(int[][] currentBoard) {
        this.currentBoard = currentBoard;
    }

    public int getMistakes() {
        return mistakes;
    }

    public void increaseMistakes() {
        this.mistakes++;
    }

    public int getRemainingChances() {
        return remainingChances;
    }

    public void decreaseChance() {
        this.remainingChances--;
    }

    public GameStatus getStatus() {
        return status;
    }

    public void setStatus(GameStatus status) {
        this.status = status;
    }
}