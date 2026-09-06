package com.example.model;

import com.example.entity.User;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "user_achievements",
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {"user_id", "achievement_id"}
                )
        }
)
public class UserAchievement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "achievement_id", nullable = false)
    private Achievement achievement;

    private LocalDateTime unlockedAt;

    public UserAchievement() {
    }

    public UserAchievement(
            User user,
            Achievement achievement
    ) {
        this.user = user;
        this.achievement = achievement;
        this.unlockedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public Achievement getAchievement() {
        return achievement;
    }

    public LocalDateTime getUnlockedAt() {
        return unlockedAt;
    }
}