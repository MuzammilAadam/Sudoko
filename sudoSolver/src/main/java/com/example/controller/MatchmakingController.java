package com.example.controller;

import com.example.dto.MatchmakingRequest;
import com.example.dto.MatchmakingResponse;
import com.example.service.MatchResult;
import com.example.service.MatchmakingService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class MatchmakingController {

    private final MatchmakingService matchmakingService;

    private final SimpMessagingTemplate messagingTemplate;


    public MatchmakingController(
            MatchmakingService matchmakingService,
            SimpMessagingTemplate messagingTemplate
    ) {
        this.matchmakingService =
                matchmakingService;

        this.messagingTemplate =
                messagingTemplate;
    }


    /*
     * User clicks:
     *
     * PLAY ONLINE
     *
     * Frontend sends:
     *
     * /app/matchmaking.join
     */
    @MessageMapping("/matchmaking.join")
    public void joinMatchmaking(
            MatchmakingRequest request
    ) {

        try {

            MatchResult result =
                    matchmakingService
                            .joinQueue(
                                    request.getUsername()
                            );


            /*
             * Send response to the player
             * who triggered this request.
             *
             * If this player was the first player,
             * this will be WAITING.
             *
             * If this player was the second player,
             * this will be MATCH_FOUND.
             */
            if (result.getFirstPlayer() != null) {

                MatchmakingResponse response =
                        result.getFirstPlayer();

                messagingTemplate.convertAndSend(
                        "/topic/matchmaking/"
                                + response.getUsername(),
                        response
                );
            }


            /*
             * Send MATCH_FOUND to the
             * other player if a match happened.
             */
            if (result.getSecondPlayer() != null) {

                MatchmakingResponse response =
                        result.getSecondPlayer();

                messagingTemplate.convertAndSend(
                        "/topic/matchmaking/"
                                + response.getUsername(),
                        response
                );
            }

        } catch (Exception e) {

            MatchmakingResponse error =
                    new MatchmakingResponse(
                            "ERROR",
                            request != null
                                    ? request.getUsername()
                                    : null,
                            null,
                            null,
                            e.getMessage(),
                            null
                    );


            if (request != null &&
                    request.getUsername() != null) {

                messagingTemplate.convertAndSend(
                        "/topic/matchmaking/"
                                + request.getUsername(),
                        error
                );
            }
        }
    }


    /*
     * User clicks:
     *
     * CANCEL SEARCH
     *
     * Frontend sends:
     *
     * /app/matchmaking.cancel
     */
    @MessageMapping("/matchmaking.cancel")
    public void cancelMatchmaking(
            MatchmakingRequest request
    ) {

        if (request == null ||
                request.getUsername() == null) {

            return;
        }


        MatchmakingResponse response =
                matchmakingService
                        .cancelQueue(
                                request.getUsername()
                        );


        messagingTemplate.convertAndSend(
                "/topic/matchmaking/"
                        + request.getUsername(),
                response
        );
    }
}