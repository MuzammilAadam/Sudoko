package com.example.service;

import com.example.dto.GameUpdate;
import com.example.dto.JoinGameRequest;
import com.example.dto.MultiplayerMove;
import com.example.model.MultiplayerGame;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class MultiplayerGameService {

    private final Map<String, MultiplayerGame> games =
            new HashMap<>();


    public MultiplayerGame createGame(
            int[][] board,
            int[][] solution
    ) {

        String roomId =
                UUID.randomUUID()
                        .toString()
                        .substring(0, 6)
                        .toUpperCase();

        MultiplayerGame game =
                new MultiplayerGame(
                        roomId,
                        board,
                        solution
                );

        games.put(roomId, game);

        return game;
    }


    public MultiplayerGame getGame(
            String roomId
    ) {

        MultiplayerGame game =
                games.get(roomId);

        if (game == null) {
            throw new RuntimeException(
                    "Game room not found"
            );
        }

        return game;
    }


    public GameUpdate joinGame(
            JoinGameRequest request
    ) {

        MultiplayerGame game =
                getGame(request.getRoomId());


        // Maximum 2 players
        if (!game.getPlayerScores()
                .containsKey(request.getUsername())) {

            if (game.getPlayerScores().size() >= 2) {

                throw new RuntimeException(
                        "Game room is full"
                );
            }

            game.getPlayerScores()
                    .put(
                            request.getUsername(),
                            0
                    );
        }


        return createUpdate(
                game,
                "Player joined: "
                        + request.getUsername(),
                request.getUsername(),
                true
        );
    }


    public GameUpdate makeMove(
            MultiplayerMove move,
            String username
    ) {

        MultiplayerGame game =
                getGame(move.getRoomId());


        if (game.isGameFinished()) {

            return createUpdate(
                    game,
                    "Game already finished",
                    username,
                    false
            );
        }


        int row = move.getRow();
        int col = move.getCol();
        int value = move.getValue();


        // Basic input validation
        if (row < 0 || row > 8 ||
                col < 0 || col > 8 ||
                value < 1 || value > 9) {

            return createUpdate(
                    game,
                    "Invalid move",
                    username,
                    false
            );
        }


        // Cannot overwrite an already filled cell
        if (game.getBoard()[row][col] != 0) {

            return createUpdate(
                    game,
                    "Cell is already filled",
                    username,
                    false
            );
        }


        boolean correct =
                game.getSolution()[row][col]
                        == value;


        if (correct) {

            // Correct move
            game.getBoard()[row][col] =
                    value;


            game.getPlayerScores()
                    .put(
                            username,
                            game.getPlayerScores()
                                    .get(username)
                                    + 10
                    );


            if (isBoardComplete(
                    game.getBoard()
            )) {

                game.setGameFinished(true);

                return createUpdate(
                        game,
                        "Game finished!",
                        username,
                        true
                );
            }


            return createUpdate(
                    game,
                    "Correct move! +10 points",
                    username,
                    true
            );

        } else {

            // Wrong move
            game.getPlayerScores()
                    .put(
                            username,
                            Math.max(
                                    game.getPlayerScores()
                                            .get(username) - 5,
                                    0
                            )
                    );


            return createUpdate(
                    game,
                    "Wrong move! -5 points",
                    username,
                    false
            );
        }
    }


    private boolean isBoardComplete(
            int[][] board
    ) {

        for (int[] row : board) {

            for (int cell : row) {

                if (cell == 0) {
                    return false;
                }
            }
        }

        return true;
    }


    private GameUpdate createUpdate(
            MultiplayerGame game,
            String message,
            String username,
            boolean valid
    ) {

        GameUpdate update =
                new GameUpdate();

        update.setBoard(
                game.getBoard()
        );

        update.setMessage(
                message
        );

        update.setPlayer(
                username
        );

        update.setValid(
                valid
        );

        update.setGameFinished(
                game.isGameFinished()
        );

        update.setPlayerScores(
                game.getPlayerScores()
        );

        return update;
    }
}