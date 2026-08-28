package com.example.service;

import com.example.dto.MoveRequest;
import com.example.dto.MoveResponse;
import com.example.generator.SudokuGenerator;
import com.example.model.Game;
import com.example.model.GameStatus;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class GameService {

    private final SudokuGenerator sudokuGenerator;

    private final Map<String, Game> games = new HashMap<>();

    public GameService(SudokuGenerator sudokuGenerator) {
        this.sudokuGenerator = sudokuGenerator;
    }

    public Game createGame(String difficulty) {

        if (difficulty == null || difficulty.isBlank()) {
            difficulty = "EASY";
        }

        int[][] puzzle =
                sudokuGenerator.generate(difficulty);

        int[][] solution =
                sudokuGenerator.generateSolution(puzzle);

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

        // Check whether move is correct
        boolean valid =
                game.getSolution()[row][col] == value;

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

        // Correct move
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