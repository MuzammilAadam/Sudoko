package com.example.model;

public class Game {

    private String gameId;

    private String difficulty;

    private int[][] puzzle;

    private int[][] solution;

    private int[][] currentBoard;

    private int mistakes;

    private int remainingChances;

    private GameStatus status;

    public Game(
            String gameId,
            String difficulty,
            int[][] puzzle,
            int[][] solution) {

        this.gameId = gameId;
        this.difficulty = difficulty;
        this.puzzle = puzzle;
        this.solution = solution;
        this.currentBoard = copyBoard(puzzle);

        this.mistakes = 0;
        this.remainingChances = 3;
        this.status = GameStatus.ACTIVE;
    }

    public String getGameId() {
        return gameId;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public int[][] getPuzzle() {
        return puzzle;
    }

    public int[][] getSolution() {
        return solution;
    }

    public int[][] getCurrentBoard() {
        return currentBoard;
    }

    public int getMistakes() {
        return mistakes;
    }

    public int getRemainingChances() {
        return remainingChances;
    }

    public GameStatus getStatus() {
        return status;
    }

    public void increaseMistakes() {
        mistakes++;
    }

    public void decreaseChance() {
        remainingChances--;
    }

    public void setStatus(GameStatus status) {
        this.status = status;
    }

    private int[][] copyBoard(int[][] board) {

        int[][] copy = new int[9][9];

        for (int i = 0; i < 9; i++) {
            copy[i] = board[i].clone();
        }

        return copy;
    }
}