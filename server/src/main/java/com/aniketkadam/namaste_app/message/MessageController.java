package com.aniketkadam.namaste_app.message;

import com.aniketkadam.namaste_app.exception.OperationNotPermittedException;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/messages")
@RequiredArgsConstructor
@Tag(name = "Message")
public class MessageController {
    private final MessageService messageService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<MessageResponse> saveMessage(
            @RequestBody MessageRequest request
    ) throws Exception {
        return ResponseEntity
                .status(HttpStatus.ACCEPTED)
                .body(messageService.saveMessage(request));
    }

    @PostMapping(value = "/upload-media", consumes = "multipart/form-data")
    public ResponseEntity<MessageResponse> uploadMedia(
            @RequestParam("chat-id") String chatId,
            @RequestParam("caption") String caption,
            @Parameter()
            @RequestPart("file") MultipartFile file,
            Authentication connectedUser
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(messageService.uploadMediaMessage(chatId, caption, file, connectedUser));
    }

    @PatchMapping
    @ResponseStatus(HttpStatus.ACCEPTED)
    public void setMessageToSeen(
            @RequestParam("chat-id") String chatId,
            Authentication connectedUser
    ) {
        messageService.setMessageToSeen(chatId, connectedUser);
    }

    @GetMapping("/chat/{chat-id}")
    public ResponseEntity<List<MessageResponse>> getAllMessages(
            @PathVariable("chat-id") String chatId
    ) {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(messageService.findChatMessages(chatId));
    }
    
    @GetMapping("/m/{message-id}")
    public ResponseEntity<MessageResponse> getMessageById(
            @PathVariable("message-id") Long messageId
    ) {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(messageService.findMessageById(messageId));
    }

    @DeleteMapping("/c/{chat-id}/d/{message-id}")
    public ResponseEntity<MessageResponse> deleteMessage(
            @PathVariable("chat-id") String chatId,
            @PathVariable("message-id") Long messageId,
            Authentication connectedUser
    ) throws OperationNotPermittedException, IOException {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(messageService.deleteMessage(chatId, messageId, connectedUser));
    }

    @GetMapping("/u/get/unread/msg")
    public ResponseEntity<Integer> getTotalUnreadMessages(
            Authentication connectedUser
    ) {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(messageService.getTotalUnreadMessages(connectedUser));
    }

    @PostMapping("/typing")
    public void handleTyping(
            @RequestBody TypingMessage request
    ) {
        messageService.handleTyping(request);
    }
}
