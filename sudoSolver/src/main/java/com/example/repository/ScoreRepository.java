package com.example.repository;

import com.example.model.Score;
import com.example.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ScoreRepository extends JpaRepository<Score, Long> {

    List<Score> findByUserOrderByCreatedAtDesc(User user);

    List<Score> findAllByOrderByScoreDesc();
}