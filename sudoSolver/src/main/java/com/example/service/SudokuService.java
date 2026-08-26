package com.example.service;

import com.example.model.SudokuValidator;
import org.springframework.stereotype.Service;

@Service
public class SudokuService {

    private final SudokuValidator validator = new SudokuValidator();

    public boolean validateMove(
            int[][] board,
            int row,
            int col,
            int value) {

        return validator.isValidMove(
                board,
                row,
                col,
                value
        );
    }
}