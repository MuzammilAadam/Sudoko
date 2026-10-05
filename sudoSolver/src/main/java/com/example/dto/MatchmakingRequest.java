package com.example.dto;

public class MatchmakingRequest {

    private String username;

    public MatchmakingRequest() {
    }

    public MatchmakingRequest(String username) {
        this.username = username;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}