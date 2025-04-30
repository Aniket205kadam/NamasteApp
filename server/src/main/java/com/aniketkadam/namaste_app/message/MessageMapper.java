package com.aniketkadam.namaste_app.message;

import com.aniketkadam.namaste_app.file.FileUtils;
import org.springframework.stereotype.Service;

@Service
public class MessageMapper {

    public MessageResponse toMessageResponse(Message message) {
        return MessageResponse.builder()
                .id(message.getId())
                .content(message.getContent())
                .senderId(message.getSenderId())
                .receiverId(message.getReceiverId())
                .createdAt(message.getCreatedDate())
                .media(FileUtils.readFileFromDestination(message.getMediaFilePath()))
                .state(message.getState())
                .type(message.getType())
                .build();
    }
}
