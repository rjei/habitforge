package org.example.habitforgebackend.repository;

import org.example.habitforgebackend.model.ChatSession;
import org.example.habitforgebackend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ChatSessionRepository extends JpaRepository<ChatSession, Long> {
    List<ChatSession> findByUserOrderByUpdatedAtDesc(User user);
}
