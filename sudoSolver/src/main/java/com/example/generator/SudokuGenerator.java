package com.example.generator;

import com.example.solver.SudokuSolver;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Component
public class SudokuGenerator {

    private final SudokuSolver solver = new SudokuSolver();

    public static class GeneratedPuzzle {
        private final int[][] puzzle;
        private final int[][] solution;

        public GeneratedPuzzle(int[][] puzzle, int[][] solution) {
            this.puzzle = puzzle;
            this.solution = solution;
        }

        public int[][] getPuzzle() {
            return puzzle;
        }

        public int[][] getSolution() {
            return solution;
        }
    }

    // BUG: Previously, generate() created a full solution board S1, removed numbers to form puzzle, but discarded S1.
    // Re-solving the puzzle later in GameService using generateSolution() could yield a different valid solution S2 if multiple solutions existed.
    // When a user placed a number matching S1, it was compared against S2, causing valid moves to be marked incorrect and reducing chances.
    // FIX: Generate the solution board and puzzle together, preserving the exact original solution S1 so that game.getSolution() matches the generated puzzle.
    public GeneratedPuzzle generatePuzzleAndSolution(String difficulty) {
        int[][] solution = new int[9][9];
        solver.solve(solution);

        int[][] puzzle = copyBoard(solution);
        int clues = getCluesForDifficulty(difficulty);
        removeNumbers(puzzle, clues);

        return new GeneratedPuzzle(puzzle, solution);
    }

    public int[][] generate(String difficulty) {
        return generatePuzzleAndSolution(difficulty).getPuzzle();
    }

    public int[][] generateSolution(int[][] puzzle) {
        int[][] solution = copyBoard(puzzle);
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

            case "EASY" -> 74;

            case "MEDIUM" -> 66;

            case "HARD" -> 60;

            case "EXPERT" -> 56;

            case "MASTER" -> 50 ;

            case "EXTREME" -> 42;

            default -> 40;
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