package com.example.service;

import com.example.dto.MoveRequest;
import com.example.dto.MoveResponse;
import com.example.generator.SudokuGenerator;
import com.example.model.Game;
import com.example.model.GameStatus;
import com.example.model.SudokuValidator;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class GameService {

    private final SudokuGenerator sudokuGenerator;
    private final SudokuValidator sudokuValidator;

    private final Map<String, Game> games = new HashMap<>();

    public GameService(SudokuGenerator sudokuGenerator, SudokuValidator sudokuValidator) {
        this.sudokuGenerator = sudokuGenerator;
        this.sudokuValidator = sudokuValidator;
    }

    public Game createGame(String difficulty) {

        if (difficulty == null || difficulty.isBlank()) {
            difficulty = "EASY";
        }

        // BUG: Previously, generate(difficulty) created puzzle and discarded solution S1, then generateSolution(puzzle) re-solved puzzle to S2. If multiple valid solutions existed, valid player moves matching S1 were rejected against S2.
        // FIX: Use generatePuzzleAndSolution() so the puzzle and its exact original solution S1 are created atomically together.
        SudokuGenerator.GeneratedPuzzle generated =
                sudokuGenerator.generatePuzzleAndSolution(difficulty);

        int[][] puzzle = generated.getPuzzle();
        int[][] solution = generated.getSolution();

        String gameId =
                UUID.randomUUID().toString();

        Game game = new Game(
                gameId,
                difficulty.toUpperCase(),
                puzzle,
                solution
        );

        games.put(gameId, game);

        return game;
    }

    public MoveResponse makeMove(
            String gameId,
            MoveRequest request) {

        Game game = games.get(gameId);

        // Game doesn't exist
        if (game == null) {

            return new MoveResponse(
                    false,
                    "Game not found",
                    null,
                    0,
                    0,
                    false,
                    false
            );
        }

        // Game already ended
        if (game.getStatus() != GameStatus.ACTIVE) {

            return new MoveResponse(
                    false,
                    "Game is no longer active",
                    game.getCurrentBoard(),
                    game.getMistakes(),
                    game.getRemainingChances(),
                    game.getStatus() == GameStatus.GAME_OVER,
                    game.getStatus() == GameStatus.COMPLETED
            );
        }

        int row = request.getRow();
        int col = request.getCol();
        int value = request.getValue();

        // Validate row
        if (row < 0 || row >= 9) {

            return invalidRequest(
                    game,
                    "Row must be between 0 and 8"
            );
        }

        // Validate column
        if (col < 0 || col >= 9) {

            return invalidRequest(
                    game,
                    "Column must be between 0 and 8"
            );
        }

        // Validate number
        if (value < 1 || value > 9) {

            return invalidRequest(
                    game,
                    "Value must be between 1 and 9"
            );
        }

        // Original cell cannot be changed
        if (game.getPuzzle()[row][col] != 0) {

            return invalidRequest(
                    game,
                    "This cell cannot be changed"
            );
        }

        // BUG: Previously, makeMove validated moves purely by checking solution[row][col] == value without checking SudokuValidator.isValidMove on the current board state.
        // FIX: First validate the move against current board rules (row, column, 3x3 grid using SudokuValidator which ignores self-cell comparison), and confirm value matches the puzzle solution.
        boolean isRuleValid = sudokuValidator.isValidMove(game.getCurrentBoard(), row, col, value);
        boolean isSolutionValid = game.getSolution()[row][col] == value;
        boolean valid = isRuleValid && isSolutionValid;

        if (!valid) {

            game.increaseMistakes();
            game.decreaseChance();

            // Third mistake
            if (game.getRemainingChances() == 0) {

                game.setStatus(GameStatus.GAME_OVER);

                return new MoveResponse(
                        false,
                        "Game Over",
                        game.getCurrentBoard(),
                        game.getMistakes(),
                        game.getRemainingChances(),
                        true,
                        false
                );
            }

            return new MoveResponse(
                    false,
                    "Wrong move",
                    game.getCurrentBoard(),
                    game.getMistakes(),
                    game.getRemainingChances(),
                    false,
                    false
            );
        }

        // Correct move: update current board with valid value ONLY after validation succeeds
        game.getCurrentBoard()[row][col] = value;

        // Check completion
        boolean completed =
                isCompleted(game.getCurrentBoard());

        if (completed) {
            game.setStatus(GameStatus.COMPLETED);
        }

        return new MoveResponse(
                true,
                completed
                        ? "Congratulations! Sudoku completed."
                        : "Correct move",
                game.getCurrentBoard(),
                game.getMistakes(),
                game.getRemainingChances(),
                false,
                completed
        );
    }

    private boolean isCompleted(int[][] board) {

        for (int row = 0; row < 9; row++) {

            for (int col = 0; col < 9; col++) {

                if (board[row][col] == 0) {
                    return false;
                }
            }
        }

        return true;
    }

    private MoveResponse invalidRequest(
            Game game,
            String message) {

        return new MoveResponse(
                false,
                message,
                game.getCurrentBoard(),
                game.getMistakes(),
                game.getRemainingChances(),
                false,
                false
        );
    }
}