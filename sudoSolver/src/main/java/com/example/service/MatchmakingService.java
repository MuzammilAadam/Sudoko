package com.example.service;

import com.example.dto.MatchmakingResponse;
import com.example.generator.SudokuGenerator;
import com.example.model.MultiplayerGame;
import org.springframework.stereotype.Service;

import java.util.ArrayDeque;
import java.util.Deque;
import java.util.HashSet;
import java.util.Set;

@Service
public class MatchmakingService {

    private final Deque<String> waitingPlayers =
            new ArrayDeque<>();

    private final Set<String> queuedPlayers =
            new HashSet<>();

    private final MultiplayerGameService multiplayerGameService;

    private final SudokuGenerator sudokuGenerator;


    public MatchmakingService(
            MultiplayerGameService multiplayerGameService,
            SudokuGenerator sudokuGenerator
    ) {
        this.multiplayerGameService =
                multiplayerGameService;

        this.sudokuGenerator =
                sudokuGenerator;
    }


    public synchronized MatchResult joinQueue(
            String username
    ) {

        validateUsername(username);

        username = username.trim();


        /*
         * Player is already waiting.
         */
        if (queuedPlayers.contains(username)) {

            MatchmakingResponse waiting =
                    new MatchmakingResponse(
                            "WAITING",
                            username,
                            null,
                            null,
                            "Already searching for an opponent.",
                            null
                    );

            return new MatchResult(
                    waiting,
                    null
            );
        }


        /*
         * Nobody is waiting.
         */
        if (waitingPlayers.isEmpty()) {

            waitingPlayers.addLast(username);

            queuedPlayers.add(username);

            MatchmakingResponse waiting =
                    new MatchmakingResponse(
                            "WAITING",
                            username,
                            null,
                            null,
                            "Finding an opponent...",
                            null
                    );

            return new MatchResult(
                    waiting,
                    null
            );
        }


        /*
         * Take the first waiting player.
         */
        String opponent =
                waitingPlayers.pollFirst();

        queuedPlayers.remove(opponent);


        /*
         * Generate Sudoku puzzle.
         */
        SudokuGenerator.GeneratedPuzzle generated =
                sudokuGenerator
                        .generatePuzzleAndSolution("MEDIUM");


        int[][] board =
                generated.getPuzzle();

        int[][] solution =
                generated.getSolution();


        /*
         * Reuse your existing multiplayer game system.
         */
        MultiplayerGame game =
                multiplayerGameService.createGame(
                        board,
                        solution
                );


        /*
         * Register both players.
         */
        synchronized (game) {

            game.getPlayerScores()
                    .put(opponent, 0);

            game.getPlayerScores()
                    .put(username, 0);
        }


        /*
         * Message for the first player.
         */
        MatchmakingResponse firstPlayer =
                new MatchmakingResponse(
                        "MATCH_FOUND",
                        opponent,
                        username,
                        game.getRoomId(),
                        "Opponent found!",
                        game.getBoard()
                );


        /*
         * Message for the second player.
         */
        MatchmakingResponse secondPlayer =
                new MatchmakingResponse(
                        "MATCH_FOUND",
                        username,
                        opponent,
                        game.getRoomId(),
                        "Opponent found!",
                        game.getBoard()
                );


        return new MatchResult(
                firstPlayer,
                secondPlayer
        );
    }


    public synchronized MatchmakingResponse cancelQueue(
            String username
    ) {

        validateUsername(username);

        username = username.trim();


        boolean removed =
                queuedPlayers.remove(username);


        if (removed) {

            waitingPlayers.remove(username);

            return new MatchmakingResponse(
                    "CANCELLED",
                    username,
                    null,
                    null,
                    "Matchmaking cancelled.",
                    null
            );
        }


        return new MatchmakingResponse(
                "NOT_WAITING",
                username,
                null,
                null,
                "You are not currently searching for an opponent.",
                null
        );
    }


    private void validateUsername(
            String username
    ) {

        if (username == null ||
                username.trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Username is required."
            );
        }
    }
}