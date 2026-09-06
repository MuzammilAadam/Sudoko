package com.example.controller;

import com.example.model.MultiplayerGame;
import com.example.service.MultiplayerGameService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/multiplayer")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://127.0.0.1:5173", "http://127.0.0.1:5174"}, originPatterns = {"http://localhost:*", "http://127.0.0.1:*"})
public class MultiplayerRestController {

    private final MultiplayerGameService multiplayerGameService;

    public MultiplayerRestController(
            MultiplayerGameService multiplayerGameService
    ) {
        this.multiplayerGameService =
                multiplayerGameService;
    }


    @PostMapping("/create")
    public ResponseEntity<?> createGame() {

        /*
         * TEMPORARY BOARD.
         *
         * Later replace this with your existing
         * SudokuGenerator output.
         */

        int[][] board = {

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


        int[][] solution = {

                {5, 3, 4, 6, 7, 8, 9, 1, 2},
                {6, 7, 2, 1, 9, 5, 3, 4, 8},
                {1, 9, 8, 3, 4, 2, 5, 6, 7},
                {8, 5, 9, 7, 6, 1, 4, 2, 3},
                {4, 2, 6, 8, 5, 3, 7, 9, 1},
                {7, 1, 3, 9, 2, 4, 8, 5, 6},
                {9, 6, 1, 5, 3, 7, 2, 8, 4},
                {2, 8, 7, 4, 1, 9, 6, 3, 5},
                {3, 4, 5, 2, 8, 6, 1, 7, 9}
        };


        MultiplayerGame game =
                multiplayerGameService
                        .createGame(
                                board,
                                solution
                        );


        Map<String, Object> response =
                new HashMap<>();

        response.put(
                "roomId",
                game.getRoomId()
        );

        response.put(
                "board",
                game.getBoard()
        );


        return ResponseEntity.ok(
                response
        );
    }
}