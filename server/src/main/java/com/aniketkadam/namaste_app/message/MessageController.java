package com.aniketkadam.namaste_app.message;

import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/messages")
@RequiredArgsConstructor
@Tag(name = "Message")
public class MessageController {
    private final MessageService messageService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void saveMessage(
            @RequestBody MessageRequest request
    ) {
        messageService.saveMessage(request);
    }

    @PostMapping(value = "/upload-media", consumes = "multipart/form-data")
    @ResponseStatus(HttpStatus.CREATED)
    public void uploadMedia(
            @RequestParam("chat-id") String chatId,
            @Parameter()
            @RequestPart("file") MultipartFile file,
            Authentication connectedUser
    ) {
        messageService.uploadMediaMessage(chatId, file, connectedUser);
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
}
