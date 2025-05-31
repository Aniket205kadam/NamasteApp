package com.aniketkadam.namaste_app.message;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TypingMessage {
    private String senderId;
    private String receiverId;
    private String chatId;
    private boolean typing;
}
