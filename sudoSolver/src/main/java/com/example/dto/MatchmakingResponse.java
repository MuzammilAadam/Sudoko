package com.example.dto;

public class MatchmakingResponse {

    private String type;

    private String username;

    private String opponent;

    private String roomId;

    private String message;

    private int[][] board;


    public MatchmakingResponse() {
    }


    public MatchmakingResponse(
            String type,
            String username,
            String opponent,
            String roomId,
            String message,
            int[][] board
    ) {
        this.type = type;
        this.username = username;
        this.opponent = opponent;
        this.roomId = roomId;
        this.message = message;
        this.board = board;
    }


    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }


    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }


    public String getOpponent() {
        return opponent;
    }

    public void setOpponent(String opponent) {
        this.opponent = opponent;
    }


    public String getRoomId() {
        return roomId;
    }

    public void setRoomId(String roomId) {
        this.roomId = roomId;
    }


    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }


    public int[][] getBoard() {
        return board;
    }

    public void setBoard(int[][] board) {
        this.board = board;
    }
}