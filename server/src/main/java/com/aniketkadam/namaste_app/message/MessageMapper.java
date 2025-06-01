package com.aniketkadam.namaste_app.message;

import com.aniketkadam.namaste_app.AES.AESService;
import com.aniketkadam.namaste_app.file.FileUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.Base64;

@Service
@RequiredArgsConstructor
public class MessageMapper {
    private final AESService aesService;

    private String getFileExtension(@NonNull String filename) {
        return filename.substring(filename.lastIndexOf(".") + 1);
    }

    public MessageResponse toMessageResponse(Message message) {
        try {
            String file = null;
            if (!message.getType().equals(MessageType.TEXT) && !message.getType().equals(MessageType.GIF)) {
                file = "data:"
                        + (message.getType().equals(MessageType.UNKNOWN) ? "application" : message.getType().toString().toLowerCase())
                        + "/"
                        + getFileExtension(message.getMediaFilePath())
                        + ";base64,"
                        + Base64.getEncoder()
                        .encodeToString(FileUtils
                                .readFileFromDestination(message.getMediaFilePath())
                        );
            }
            return MessageResponse.builder()
                    .id(message.getId())
                    .content(message.getContent() != null ? aesService.decrypt(message.getContent()) : null)
                    .senderId(message.getSenderId())
                    .receiverId(message.getReceiverId())
                    .createdAt(message.getCreatedDate())
                    .media(file)
                    .caption(message.getCaption())
                    .state(message.getState())
                    .type(message.getType())
                    .gifUrl(message.getGifUrl())
                    .fileOriginalName(message.getFileOriginalName())
                    .replyId(message.getReplyId())
                    .isDeleted(message.getIsDeleted() != null && message.getIsDeleted())
                    .isDeletedFromReceiver(message.getIsDeletedFromReceiver() != null && message.getIsDeletedFromReceiver())
                    .build();
        } catch (Exception e) {
            System.out.println("Failed to convert message in plain text: " + e.getMessage());
        }
        return null;
    }
}
