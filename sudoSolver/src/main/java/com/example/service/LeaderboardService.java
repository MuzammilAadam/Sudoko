package com.example.service;

import com.example.dto.LeaderboardResponse;
import com.example.model.Score;
import com.example.repository.ScoreRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class LeaderboardService {

    private final ScoreRepository scoreRepository;

    public LeaderboardService(
            ScoreRepository scoreRepository
    ) {
        this.scoreRepository = scoreRepository;
    }

    public List<LeaderboardResponse> getLeaderboard() {

        List<Score> scores =
                scoreRepository.findAllByOrderByScoreDesc();

        List<LeaderboardResponse> leaderboard =
                new ArrayList<>();

        Set<Long> addedUsers =
                new HashSet<>();

        int rank = 1;

        for (Score score : scores) {

            Long userId =
                    score.getUser().getId();

            // Skip if this user's score
            // is already added
            if (addedUsers.contains(userId)) {
                continue;
            }

            leaderboard.add(
                    new LeaderboardResponse(
                            rank,
                            score.getUser().getUsername(),
                            score.getScore(),
                            score.getDifficulty(),
                            score.getMistakes(),
                            score.getTimeTaken()
                    )
            );

            addedUsers.add(userId);

            rank++;
        }

        return leaderboard;
    }
}