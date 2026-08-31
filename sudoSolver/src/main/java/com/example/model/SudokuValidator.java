package com.example.model;

import org.springframework.stereotype.Component;

@Component
public class SudokuValidator {

    public boolean isValidMove(
            int[][] board,
            int row,
            int col,
            int value) {

        // BUG: If board is null or row/col/value are out of bounds, validation could crash or behave unpredictably.
        // FIX: Added guard check to ensure board is not null, coordinates are valid (0-8), and value is within Sudoku range (1-9).
        if (board == null || row < 0 || row >= 9 || col < 0 || col >= 9 || value < 1 || value > 9) {
            return false;
        }

        // BUG: If row validation does not skip the target column (i == col), placing a number into a cell that already contains it would trigger a self-duplicate error.
        // FIX: Explicitly exclude i != col so the selected cell is not compared against itself during row validation.
        for (int i = 0; i < 9; i++) {
            if (i != col && board[row][i] == value) {
                return false;
            }
        }

        // BUG: If column validation does not skip the target row (i == row), placing a number into a cell that already contains it would trigger a self-duplicate error.
        // FIX: Explicitly exclude i != row so the selected cell is not compared against itself during column validation.
        for (int i = 0; i < 9; i++) {
            if (i != row && board[i][col] == value) {
                return false;
            }
        }

        // Find starting position of 3x3 box
        int startRow = (row / 3) * 3;
        int startCol = (col / 3) * 3;

        // BUG: If 3x3 grid validation compares cell (row, col) against itself, a valid move or pre-populated cell would trigger a false duplicate.
        // FIX: Explicitly check (i != row || j != col) so the selected cell is not compared against itself during 3x3 grid validation.
        for (int i = startRow; i < startRow + 3; i++) {
            for (int j = startCol; j < startCol + 3; j++) {
                if ((i != row || j != col) && board[i][j] == value) {
                    return false;
                }
            }
        }

        return true;
    }
}