package com.example.solver;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class SudokuSolver {

    public boolean solve(int[][] board) {

        int[] emptyCell = findEmptyCell(board);

        // No empty cell means Sudoku is solved
        if (emptyCell == null) {
            return true;
        }

        int row = emptyCell[0];
        int col = emptyCell[1];

        List<Integer> numbers = new ArrayList<>();

        for (int i = 1; i <= 9; i++) {
            numbers.add(i);
        }

        // Random order
        Collections.shuffle(numbers);

        for (int value : numbers) {

            if (isValid(board, row, col, value)) {

                board[row][col] = value;

                if (solve(board)) {
                    return true;
                }

                // Backtrack
                board[row][col] = 0;
            }
        }

        return false;
    }

    private int[] findEmptyCell(int[][] board) {

        for (int row = 0; row < 9; row++) {

            for (int col = 0; col < 9; col++) {

                if (board[row][col] == 0) {
                    return new int[]{row, col};
                }
            }
        }

        return null;
    }

    private boolean isValid(
            int[][] board,
            int row,
            int col,
            int value) {

        // Row
        for (int i = 0; i < 9; i++) {

            if (board[row][i] == value) {
                return false;
            }
        }

        // Column
        for (int i = 0; i < 9; i++) {

            if (board[i][col] == value) {
                return false;
            }
        }

        // 3x3 box
        int startRow = (row / 3) * 3;
        int startCol = (col / 3) * 3;

        for (int i = startRow; i < startRow + 3; i++) {

            for (int j = startCol; j < startCol + 3; j++) {

                if (board[i][j] == value) {
                    return false;
                }
            }
        }

        return true;
    }
}