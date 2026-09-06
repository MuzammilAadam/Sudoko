package com.example.model;

import jakarta.persistence.*;

@Entity
@Table(name = "achievements")
public class Achievement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String code;

    @Column(nullable = false)
    private String name;

    private String description;

    private int xpReward;

    private String rarity;

    public Achievement() {
    }

    public Achievement(
            String code,
            String name,
            String description,
            int xpReward,
            String rarity
    ) {
        this.code = code;
        this.name = name;
        this.description = description;
        this.xpReward = xpReward;
        this.rarity = rarity;
    }

    public Long getId() {
        return id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getXpReward() {
        return xpReward;
    }

    public void setXpReward(int xpReward) {
        this.xpReward = xpReward;
    }

    public String getRarity() {
        return rarity;
    }

    public void setRarity(String rarity) {
        this.rarity = rarity;
    }
}