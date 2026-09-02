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


    @MessageMapping("/game.join")
    public void joinGame(
            JoinGameRequest request
    ) {

        GameUpdate update =
                multiplayerGameService
                        .joinGame(request);


        messagingTemplate.convertAndSend(
                "/topic/game/"
                        + request.getRoomId(),
                update
        );
    }


    @MessageMapping("/game.move")
    public void makeMove(
            MultiplayerMove move
    ) {

        /*
         * TODO:
         * Replace this with username extracted
         * from authenticated WebSocket JWT session.
         */
        String username = "Player";


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
    }
}