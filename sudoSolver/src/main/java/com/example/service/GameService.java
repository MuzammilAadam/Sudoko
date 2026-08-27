package com.example.service;

import com.example.dto.MoveRequest;
import com.example.dto.MoveResponse;
import com.example.model.Game;
import com.example.model.GameStatus;
import com.example.model.SudokuValidator;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class GameService {

    private final SudokuValidator validator = new SudokuValidator();

    private final Map<String, Game> games = new HashMap<>();

    public Game createGame() {

        int[][] puzzle = {
                {5, 3, 0, 0, 7, 0, 0, 0, 0},
                {6, 0, 0, 1, 9, 5, 0, 0, 0},
                {0, 9, 8, 0, 0, 0, 0, 6, 0},
                {8, 0, 0, 0, 6, 0, 0, 0, 3},
                {4, 0, 0, 8, 0, 3, 0, 0, 1},
                {7, 0, 0, 0, 2, 0, 0, 0, 6},
                {0, 6, 0, 0, 0, 0, 2, 8, 0},
                {0, 0, 0, 4, 1, 9, 0, 0, 5},
                {0, 0, 0, 0, 8, 0, 0, 7, 9}
        };

        int[][] currentBoard = copyBoard(puzzle);

        String gameId = UUID.randomUUID().toString();
        System.out.println(gameId);

        Game game = new Game(
                gameId,
                puzzle,
                currentBoard
        );

        games.put(gameId, game);

        return game;
    }

    public MoveResponse makeMove(
            String gameId,
            MoveRequest request) {

        Game game = games.get(gameId);

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

        // Validate position
        if (row < 0 || row >= 9 || col < 0 || col >= 9) {

            return new MoveResponse(
                    false,
                    "Invalid cell position",
                    game.getCurrentBoard(),
                    game.getMistakes(),
                    game.getRemainingChances(),
                    false,
                    false
            );
        }

        // Validate value
        if (value < 1 || value > 9) {

            return new MoveResponse(
                    false,
                    "Value must be between 1 and 9",
                    game.getCurrentBoard(),
                    game.getMistakes(),
                    game.getRemainingChances(),
                    false,
                    false
            );
        }

        // Check whether the cell is an original puzzle cell
        if (game.getPuzzle()[row][col] != 0) {

            return new MoveResponse(
                    false,
                    "This cell cannot be changed",
                    game.getCurrentBoard(),
                    game.getMistakes(),
                    game.getRemainingChances(),
                    false,
                    false
            );
        }

        // Check Sudoku rules
        boolean valid = validator.isValidMove(
                game.getCurrentBoard(),
                row,
                col,
                value
        );

        if (!valid) {

            game.increaseMistakes();
            game.decreaseChance();

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
                    "Invalid move",
                    game.getCurrentBoard(),
                    game.getMistakes(),
                    game.getRemainingChances(),
                    false,
                    false
            );
        }

        // Correct move
        game.getCurrentBoard()[row][col] = value;

        // Check whether the puzzle is completed
        boolean completed = isCompleted(game.getCurrentBoard());

        if (completed) {
            game.setStatus(GameStatus.COMPLETED);
        }

        return new MoveResponse(
                true,
                completed ? "Congratulations! Sudoku completed." : "Correct move",
                game.getCurrentBoard(),
                game.getMistakes(),
                game.getRemainingChances(),
                false,
                completed
        );
    }

    private boolean isCompleted(int[][] board) {

        for (int i = 0; i < board.length; i++) {

            for (int j = 0; j < board[i].length; j++) {

                if (board[i][j] == 0) {
                    return false;
                }
            }
        }

        return true;
    }

    private int[][] copyBoard(int[][] board) {

        int[][] copy = new int[board.length][];

        for (int i = 0; i < board.length; i++) {
            copy[i] = board[i].clone();
        }

        return copy;
    }
}