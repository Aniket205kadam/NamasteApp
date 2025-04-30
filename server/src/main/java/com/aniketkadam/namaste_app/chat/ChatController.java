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
}
