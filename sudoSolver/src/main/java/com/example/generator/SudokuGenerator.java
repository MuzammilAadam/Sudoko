package com.example.generator;

import com.example.solver.SudokuSolver;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Component
public class SudokuGenerator {

    private final SudokuSolver solver = new SudokuSolver();

    public int[][] generate(String difficulty) {

        // Create empty board
        int[][] solution = new int[9][9];

        // Generate complete Sudoku
        solver.solve(solution);

        // Create puzzle from solution
        int[][] puzzle = copyBoard(solution);

        int clues = getCluesForDifficulty(difficulty);

        removeNumbers(puzzle, clues);

        return puzzle;
    }

    public int[][] generateSolution(int[][] puzzle) {

        int[][] solution = copyBoard(puzzle);

        solver.solve(solution);

        return solution;
    }

    private void removeNumbers(
            int[][] board,
            int clues) {

        List<Integer> positions = new ArrayList<>();

        for (int i = 0; i < 81; i++) {
            positions.add(i);
        }

        Collections.shuffle(positions);

        int cellsToRemove = 81 - clues;

        for (int i = 0; i < cellsToRemove; i++) {

            int position = positions.get(i);

            int row = position / 9;
            int col = position % 9;

            board[row][col] = 0;
        }
    }

    private int getCluesForDifficulty(String difficulty) {

        if (difficulty == null) {
            return 36;
        }

        return switch (difficulty.toUpperCase()) {

            case "EASY" -> 50;

            case "MEDIUM" -> 32;

            case "HARD" -> 28;

            case "EXPERT" -> 24;

            case "MASTER" -> 20;

            case "EXTREME" -> 16;

            default -> 36;
        };
    }

    private int[][] copyBoard(int[][] board) {

        int[][] copy = new int[9][9];

        for (int i = 0; i < 9; i++) {
            copy[i] = board[i].clone();
        }

        return copy;
    }
}