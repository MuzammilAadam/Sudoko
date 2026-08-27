package com.example.model;

public class SudokuValidator {

    public boolean isValidMove(
            int[][] board,
            int row,
            int col,
            int value) {

        // Check row
        for (int i = 0; i < board[0].length; i++) {

            if (i != col && board[row][i] == value) {
                return false;
            }
        }

        // Check column
        for (int i = 0; i < board.length; i++) {

            if (i != row && board[i][col] == value) {
                return false;
            }
        }

        // Find starting position of 3x3 box
        int startRow = (row / 3) * 3;
        int startCol = (col / 3) * 3;

        // Check 3x3 box
        for (int i = startRow; i < startRow + 3; i++) {

            for (int j = startCol; j < startCol + 3; j++) {

                if ((i != row || j != col)
                        && board[i][j] == value) {

                    return false;
                }
            }
        }

        return true;
    }
}