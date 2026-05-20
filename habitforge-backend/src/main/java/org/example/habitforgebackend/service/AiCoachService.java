package org.example.habitforgebackend.service;

import org.example.habitforgebackend.dto.ai.*;
import org.example.habitforgebackend.model.*;
import org.example.habitforgebackend.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AiCoachService {

    private static final Logger log = LoggerFactory.getLogger(AiCoachService.class);

    private final UserRepository userRepository;
    private final ChatSessionRepository chatSessionRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final MoodLogRepository moodLogRepository;
    private final UserContextBuilder userContextBuilder;
    private final PromptBuilder promptBuilder;
    private final LlmClient llmClient;

    public AiCoachService(
            UserRepository userRepository,
            ChatSessionRepository chatSessionRepository,
            ChatMessageRepository chatMessageRepository,
            MoodLogRepository moodLogRepository,
            UserContextBuilder userContextBuilder,
            PromptBuilder promptBuilder,
            LlmClient llmClient
    ) {
        this.userRepository = userRepository;
        this.chatSessionRepository = chatSessionRepository;
        this.chatMessageRepository = chatMessageRepository;
        this.moodLogRepository = moodLogRepository;
        this.userContextBuilder = userContextBuilder;
        this.promptBuilder = promptBuilder;
        this.llmClient = llmClient;
    }

    @Transactional
    public ChatMessageResponse sendMessageToCoach(String username, ChatRequest request) {
        User user = getUserByUsername(username);
        ChatSession session;

        if (request.sessionId() != null) {
            session = chatSessionRepository.findById(request.sessionId())
                    .orElseThrow(() -> new IllegalArgumentException("Chat session not found"));
            if (!session.getUser().getId().equals(user.getId())) {
                throw new IllegalArgumentException("Unauthorized access to this chat session");
            }
        } else {
            session = new ChatSession();
            session.setUser(user);
            String title = request.message();
            if (title.length() > 30) {
                title = title.substring(0, 30) + "...";
            }
            session.setSessionTitle(title);
            session = chatSessionRepository.save(session);
        }

        // Save User Message
        ChatMessage userMessage = new ChatMessage();
        userMessage.setChatSession(session);
        userMessage.setRole(ChatRole.USER);
        userMessage.setContent(request.message());
        userMessage.setSentAt(LocalDateTime.now());
        chatMessageRepository.save(userMessage);

        // Get History (excluding the message we just saved)
        List<ChatMessage> fullHistory = chatMessageRepository.findByChatSessionOrderBySentAtAsc(session);
        List<ChatMessage> previousHistory = fullHistory.isEmpty()
                ? List.of()
                : fullHistory.subList(0, fullHistory.size() - 1);

        // Build prompt and context
        UserContextDto context = userContextBuilder.buildContext(username);
        String systemPrompt = promptBuilder.buildSystemPrompt(context);

        String replyContent;
        try {
            replyContent = llmClient.generateContentWithHistory(systemPrompt, previousHistory, request.message());
        } catch (Exception e) {
            log.error("AI Coach call failed, using fallback: {}", e.getMessage());
            replyContent = "Hi " + username + "! It seems I'm temporarily offline or my connection limit was reached, " +
                    "but I'm still here to encourage you. Remember the Feynman Technique: to truly master your habits, " +
                    "explain them simply to others and identify where your consistency gaps are. " +
                    "You are at level " + context.level() + " and doing great. Keep tracking your progress!";
        }

        // Save Assistant Message
        ChatMessage assistantMessage = new ChatMessage();
        assistantMessage.setChatSession(session);
        assistantMessage.setRole(ChatRole.ASSISTANT);
        assistantMessage.setContent(replyContent);
        assistantMessage.setSentAt(LocalDateTime.now());
        ChatMessage savedAssistantMessage = chatMessageRepository.save(assistantMessage);

        // Update session timestamp
        session.setUpdatedAt(LocalDateTime.now());
        chatSessionRepository.save(session);

        return new ChatMessageResponse(
                savedAssistantMessage.getId(),
                session.getId(),
                session.getSessionTitle(),
                savedAssistantMessage.getRole().name(),
                savedAssistantMessage.getContent(),
                savedAssistantMessage.getSentAt()
        );
    }

    @Transactional(readOnly = true)
    public List<ChatSessionResponse> getUserSessions(String username) {
        User user = getUserByUsername(username);
        return chatSessionRepository.findByUserOrderByUpdatedAtDesc(user).stream()
                .map(s -> new ChatSessionResponse(s.getId(), s.getSessionTitle(), s.getCreatedAt(), s.getUpdatedAt()))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ChatMessageResponse> getSessionMessages(String username, Long sessionId) {
        User user = getUserByUsername(username);
        ChatSession session = chatSessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Chat session not found"));
        if (!session.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Unauthorized access to this chat session");
        }

        return chatMessageRepository.findByChatSessionOrderBySentAtAsc(session).stream()
                .map(m -> new ChatMessageResponse(
                        m.getId(),
                        session.getId(),
                        session.getSessionTitle(),
                        m.getRole().name(),
                        m.getContent(),
                        m.getSentAt()
                ))
                .toList();
    }

    @Transactional
    public MoodResponse logMood(String username, MoodCreateRequest request) {
        User user = getUserByUsername(username);

        MoodLog moodLog = new MoodLog();
        moodLog.setUser(user);
        moodLog.setMoodScore(request.moodScore());
        moodLog.setNote(request.note());
        moodLog.setLoggedAt(LocalDateTime.now());
        MoodLog saved = moodLogRepository.save(moodLog);

        return new MoodResponse(saved.getId(), saved.getMoodScore(), saved.getNote(), saved.getLoggedAt());
    }

    private User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));
    }
}
