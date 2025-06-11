package com.aniketkadam.namaste_app.message;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessageRequest {

    private String content;
    private String senderId;
    private String receiverId;
    private MessageType type;
    private String chatId;
    private String gifUrl;
    private String replyId;
}
