package com.aniketkadam.namaste_app.message;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessageResponse {

    private Long id;
    private String content;
    private MessageType type;
    private MessageState state;
    private String senderId;
    private String receiverId;
    private LocalDateTime createdAt;
    private String media;
    private String caption;
    private String gifUrl;
    private String fileOriginalName;
    private String replyId;
    private boolean isDeleted;
    private boolean isDeletedFromReceiver;
}
