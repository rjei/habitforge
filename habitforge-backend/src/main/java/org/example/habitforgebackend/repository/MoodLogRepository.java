package org.example.habitforgebackend.repository;

import org.example.habitforgebackend.model.MoodLog;
import org.example.habitforgebackend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface MoodLogRepository extends JpaRepository<MoodLog, Long> {
    List<MoodLog> findByUserOrderByLoggedAtDesc(User user);
    List<MoodLog> findByUserAndLoggedAtAfterOrderByLoggedAtDesc(User user, LocalDateTime loggedAtAfter);
}
