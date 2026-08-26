package com.example.model;

public class SudokuValidator {

    public boolean isValidMove(
            int[][] board,
            int row,
            int col,
            int value) {

        // Check row
        for (int i = 0; i < board[0].length; i++) {
            if (board[row][i] == value) {
                return false;
            }
        }

        // Check column
        for (int i = 0; i < board.length; i++) {
            if (board[i][col] == value) {
                return false;
            }
        }

        // Check 3x3 grid
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