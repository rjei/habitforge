package org.example.habitforgebackend.repository;

import org.example.habitforgebackend.model.User;
import org.example.habitforgebackend.model.UserReward;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRewardRepository extends JpaRepository<UserReward, Long> {
    List<UserReward> findByUserOrderByEarnedAtDesc(User user);
    boolean existsByUserIdAndRewardId(Long userId, Long rewardId);
}
