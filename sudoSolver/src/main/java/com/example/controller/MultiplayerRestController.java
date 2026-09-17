package com.example.controller;

import com.example.generator.SudokuGenerator;
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
    private final SudokuGenerator sudokuGenerator;

    public MultiplayerRestController(
            MultiplayerGameService multiplayerGameService,
            SudokuGenerator sudokuGenerator
    ) {
        this.multiplayerGameService =
                multiplayerGameService;
        this.sudokuGenerator =
                sudokuGenerator;
    }


    @PostMapping("/create")
    public ResponseEntity<?> createGame() {

        /*
         * Generate a fresh puzzle and solution dynamically using SudokuGenerator
         * ensuring every multiplayer room has a unique board.
         */
        SudokuGenerator.GeneratedPuzzle generated =
                sudokuGenerator.generatePuzzleAndSolution("MEDIUM");

        int[][] board = generated.getPuzzle();
        int[][] solution = generated.getSolution();

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