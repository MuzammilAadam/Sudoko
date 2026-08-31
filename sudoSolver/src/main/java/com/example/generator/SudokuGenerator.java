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

        // LOGIC FIX: Use solveDeterministic instead of randomized solver.solve.
        // Solving an existing puzzle with randomized backtracking is inefficient (allocates
        // arraylists on every cell step) and can produce inconsistent results if multiple solutions exist.
        solver.solveDeterministic(solution);

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

        // LOGIC FIX: Clamp clues to a safe range [17, 81].
        // 1) Sudoku mathematically requires at least 17 clues to be solvable.
        // 2) Clamping prevents negative values in cellsToRemove = (81 - safeClues),
        // preventing IndexOutOfBoundsException when accessing positions.
        int safeClues = Math.max(17, Math.min(81, clues));
        int cellsToRemove = 81 - safeClues;

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

        // LOGIC FIX: Updated "EXTREME" clues from 16 to 17.
        // A standard 9x9 Sudoku puzzle cannot have fewer than 17 clues while maintaining a valid solution.
        return switch (difficulty.toUpperCase()) {

            case "EASY" -> 50;

            case "MEDIUM" -> 32;

            case "HARD" -> 28;

            case "EXPERT" -> 24;

            case "MASTER" -> 20;

            case "EXTREME" -> 17;

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