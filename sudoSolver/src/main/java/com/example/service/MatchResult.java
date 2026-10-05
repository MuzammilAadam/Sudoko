package com.example.service;

import com.example.dto.MatchmakingResponse;

public class MatchResult {

    private final MatchmakingResponse firstPlayer;
    private final MatchmakingResponse secondPlayer;

    public MatchResult(
            MatchmakingResponse firstPlayer,
            MatchmakingResponse secondPlayer
    ) {
        this.firstPlayer = firstPlayer;
        this.secondPlayer = secondPlayer;
    }

    public MatchmakingResponse getFirstPlayer() {
        return firstPlayer;
    }

    public MatchmakingResponse getSecondPlayer() {
        return secondPlayer;
    }
}