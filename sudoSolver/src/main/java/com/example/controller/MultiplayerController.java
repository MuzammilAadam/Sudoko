package com.example.controller;

import com.example.dto.GameUpdate;
import com.example.dto.JoinGameRequest;
import com.example.dto.MultiplayerMove;
import com.example.service.MultiplayerGameService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class MultiplayerController {

    private final MultiplayerGameService multiplayerGameService;

    private final SimpMessagingTemplate messagingTemplate;


    public MultiplayerController(
            MultiplayerGameService multiplayerGameService,
            SimpMessagingTemplate messagingTemplate
    ) {
        this.multiplayerGameService =
                multiplayerGameService;

        this.messagingTemplate =
                messagingTemplate;
    }


    /*
     * ISSUE IDENTIFIED & FIXED:
     * Previously, if joinGame threw a RuntimeException ("Game room is full" or "Game room not found"),
     * it was unhandled, causing the WebSocket broker to drop the message without informing the client.
     * FIX: Catch exception and send an error GameUpdate back to the topic so frontend can display the error.
     */
    @MessageMapping("/game.join")
    public void joinGame(
            JoinGameRequest request
    ) {
        try {
            GameUpdate update =
                    multiplayerGameService
                            .joinGame(request);

            messagingTemplate.convertAndSend(
                    "/topic/game/"
                            + request.getRoomId(),
                    update
            );
        } catch (Exception e) {
            GameUpdate errorUpdate = new GameUpdate();
            errorUpdate.setMessage(e.getMessage());
            errorUpdate.setPlayer(request.getUsername());
            errorUpdate.setValid(false);
            messagingTemplate.convertAndSend(
                    "/topic/game/" + request.getRoomId(),
                    errorUpdate
            );
        }
    }


    /*
     * ISSUE IDENTIFIED & FIXED:
     * Missing leave room endpoint in backend WebSocket!
     * When a player clicked "Exit Room" or closed their session, the backend had no mapping for "/game.leave".
     * Therefore, the leaving player was never removed from the game room state, the remaining player
     * was never notified that their opponent left, and empty rooms caused memory leaks.
     * FIX: Added @MessageMapping("/game.leave") which delegates to multiplayerGameService.leaveGame()
     * and broadcasts the departure update to the room topic.
     */
    @MessageMapping("/game.leave")
    public void leaveGame(
            JoinGameRequest request
    ) {
        if (request == null || request.getRoomId() == null) {
            return;
        }

        GameUpdate update =
                multiplayerGameService
                        .leaveGame(
                                request.getRoomId(),
                                request.getUsername()
                        );

        if (update != null) {
            messagingTemplate.convertAndSend(
                    "/topic/game/"
                            + request.getRoomId(),
                    update
            );
        }
    }


    @MessageMapping("/game.move")
    public void makeMove(
            MultiplayerMove move
    ) {
        try {
            /*
             * Username is sent by the frontend as part of the MultiplayerMove DTO payload.
             * It is used to attribute correct/wrong moves to the right player and update their score.
             */
            GameUpdate update =
                    multiplayerGameService
                            .makeMove(
                                    move,
                                    move.getUsername()
                            );

            messagingTemplate.convertAndSend(
                    "/topic/game/"
                            + move.getRoomId(),
                    update
            );
        } catch (Exception e) {
            GameUpdate errorUpdate = new GameUpdate();
            errorUpdate.setMessage(e.getMessage());
            errorUpdate.setPlayer(move.getUsername());
            errorUpdate.setValid(false);
            messagingTemplate.convertAndSend(
                    "/topic/game/" + move.getRoomId(),
                    errorUpdate
            );
        }
    }
}