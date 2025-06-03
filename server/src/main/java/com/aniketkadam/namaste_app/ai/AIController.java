package com.aniketkadam.namaste_app.ai;

import com.aniketkadam.namaste_app.user.UserResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/ai")
@RequiredArgsConstructor
@Tag(name = "AIController")
public class AIController {
    private final AIService service;

    @GetMapping("/bot")
    public ResponseEntity<UserResponse> getAIBot() {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(service.findAIBot());
    }

    @GetMapping("/enhance/message")
    public ResponseEntity<?> enhanceMessage(
            @RequestParam("message") String message
    ) {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(service.enhanceMessage(message));
    }
}
