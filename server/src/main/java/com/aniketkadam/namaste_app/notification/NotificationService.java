package com.aniketkadam.namaste_app.notification;

import com.aniketkadam.namaste_app.message.MessageResponse;
import com.aniketkadam.namaste_app.message.TypingMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {
    private final SimpMessagingTemplate messagingTemplate;

    public void sendNotification(String userId, Notification notification) {
        log.info("Sending WS notification to {} with payload {}", userId, notification);
        messagingTemplate.convertAndSendToUser(
                userId,
                "/chat",
                notification
        );
    }

    public void sendTypingMessage(String userId, TypingMessage message) {
        messagingTemplate.convertAndSendToUser(
                userId,
                "/message/typing",
                message
        );

    }
}
