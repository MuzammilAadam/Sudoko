package com.example.dto;

public class LoginResponse {
    private Long id;
    private String token;
    private String username;
    private String role;
    private int totalXP;
    private int level;

    public LoginResponse(String token, String username, String role) {
        this.token = token;
        this.username = username;
        this.role = role;
    }

    public LoginResponse(Long id, String token, String username, String role, int totalXP, int level) {
        this.id = id;
        this.token = token;
        this.username = username;
        this.role = role;
        this.totalXP = totalXP;
        this.level = level;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public int getTotalXP() {
        return totalXP;
    }

    public void setTotalXP(int totalXP) {
        this.totalXP = totalXP;
    }

    public int getLevel() {
        return level;
    }

    public void setLevel(int level) {
        this.level = level;
    }
}
