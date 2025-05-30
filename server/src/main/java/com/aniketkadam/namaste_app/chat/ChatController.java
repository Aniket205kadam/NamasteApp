package com.aniketkadam.namaste_app.chat;

import com.aniketkadam.namaste_app.common.StringResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/chats")
@RequiredArgsConstructor
@Tag(name = "Chat")
public class ChatController {
    private final ChatService service;

    @PostMapping
    public ResponseEntity<StringResponse> createChat(
            @RequestParam("sender-id") String senderId,
            @RequestParam("receiver-id") String receiverId
    ) {
        final String chatId = service.createChat(senderId, receiverId);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(StringResponse.builder()
                        .response(chatId)
                        .build()
                );
    }

    @GetMapping
    public ResponseEntity<List<ChatResponse>> getChatsByUser(
            Authentication connectedUser
    ) {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(service.getChatsByUser(connectedUser));
    }

    @GetMapping("/c/{chat-id}")
    public ResponseEntity<ChatResponse> getChatById(
            @PathVariable("chat-id") String chatId,
            Authentication connectedUser
    ) {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(service.getChatById(chatId, connectedUser));
    }

    @GetMapping("/u1/{user1-id}/u2/{user2-id}")
    public ResponseEntity<String> getChatByTwoUser(
            @PathVariable("user1-id") String user1Id,
            @PathVariable("user2-id") String user2Id
    ) {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(service.getChatByTwoUser(user1Id, user2Id));
    }
}
