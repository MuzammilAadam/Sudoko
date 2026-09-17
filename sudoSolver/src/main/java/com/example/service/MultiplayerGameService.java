package com.example.service;

import com.example.dto.GameUpdate;
import com.example.dto.JoinGameRequest;
import com.example.dto.MultiplayerMove;
import com.example.model.MultiplayerGame;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class MultiplayerGameService {

    /*
     * ISSUE IDENTIFIED & FIXED:
     * Previously: private final Map<String, MultiplayerGame> games = new HashMap<>();
     * HashMap is not thread-safe. Spring WebSocket message broker processes incoming
     * STOMP messages (/app/game.join, /app/game.move) concurrently across multiple worker threads.
     * Simultaneous joins, moves, or room creations cause race conditions or ConcurrentModificationException.
     * FIX: Use ConcurrentHashMap to guarantee safe concurrent access.
     */
    private final Map<String, MultiplayerGame> games =
            new ConcurrentHashMap<>();


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

        synchronized (game) {
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
    }


    /*
     * ISSUE IDENTIFIED & FIXED:
     * Previously, there was NO leave room logic in the backend WebSocket service.
     * When a player exited:
     * 1. Their username remained indefinitely in playerScores, locking room size at 2.
     * 2. This prevented any new player or re-joining player from entering ("Game room is full").
     * 3. The other player was never notified that their opponent disconnected or exited.
     * 4. Empty rooms were never cleaned up, causing memory leaks over time.
     *
     * FIX:
     * 1. Remove the player from playerScores.
     * 2. If the room is now empty, purge it from the 'games' map.
     * 3. If an opponent remains, broadcast a GameUpdate notifying them that the player left.
     */
    public GameUpdate leaveGame(
            String roomId,
            String username
    ) {
        MultiplayerGame game = games.get(roomId);
        if (game == null) {
            return null;
        }

        synchronized (game) {
            if (username != null) {
                game.getPlayerScores().remove(username);
            }

            // If no players remain, clean up room to prevent memory leaks
            if (game.getPlayerScores().isEmpty()) {
                games.remove(roomId);
                return null;
            }

            return createUpdate(
                    game,
                    "Player " + (username != null ? username : "Opponent") + " left the room.",
                    username,
                    false
            );
        }
    }


    public GameUpdate makeMove(
            MultiplayerMove move,
            String username
    ) {

        MultiplayerGame game =
                getGame(move.getRoomId());

        // ISSUE IDENTIFIED & FIXED: Multiple players sending moves simultaneously can cause race conditions on board state & scores.
        // FIX: Synchronize on the game object to guarantee atomic move processing.
        synchronized (game) {
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