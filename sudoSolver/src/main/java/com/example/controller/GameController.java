package com.example.controller;

import com.example.dto.CreateGameRequest;
import com.example.dto.MoveRequest;
import com.example.dto.MoveResponse;
import com.example.model.Game;
import com.example.service.GameService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/games")
@CrossOrigin(origins = "http://localhost:5173")
public class GameController {

    private final GameService gameService;

    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    @PostMapping
    public ResponseEntity<Game> createGame(
            @RequestBody(required = false)
            CreateGameRequest request) {

        String difficulty = "EASY";

        if (request != null
                && request.getDifficulty() != null) {
            difficulty = request.getDifficulty();
        }

        Game game =
                gameService.createGame(difficulty);

        return ResponseEntity.ok(game);
    }

    @PostMapping("/{gameId}/moves")
    public ResponseEntity<MoveResponse> makeMove(
            @PathVariable String gameId,
            @RequestBody MoveRequest request) {

        MoveResponse response =
                gameService.makeMove(
                        gameId,
                        request
                );

        return ResponseEntity.ok(response);
    }
}