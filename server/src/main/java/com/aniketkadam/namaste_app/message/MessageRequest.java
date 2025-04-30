package com.aniketkadam.namaste_app.message;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MessageRequest {

    private String content;
    private String senderId;
    private String receiverId;
    private MessageType type;
    private String chatId;
}
