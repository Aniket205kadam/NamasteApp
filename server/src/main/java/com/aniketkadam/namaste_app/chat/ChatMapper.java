package com.aniketkadam.namaste_app.chat;

import com.aniketkadam.namaste_app.AES.AESService;
import com.aniketkadam.namaste_app.user.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ChatMapper {
    private final UserMapper mapper;
    private final AESService aesService;

    public ChatResponse toChatResponse(Chat chat, String senderId) {
        try {
            return ChatResponse.builder()
                    .id(chat.getId())
                    .name(chat.getChatName(senderId))
                    .avtar(mapper.toUserResponse(chat.getTargetUser(senderId)).getAvtar())
                    .unreadCount(chat.getUnreadMessages(senderId))
                    .lastMessage(chat.getLastMessage().startsWith("Attachment") ? chat.getLastMessage() : aesService.decrypt(chat.getLastMessage()))
                    .lastMessageTime(chat.getLastMessageTime())
                    .isRecipientOnline(chat.getRecipient().isUserOnline())
                    .senderId(chat.getSender().getId())
                    .receiverId(chat.getRecipient().getId())
                    .build();
        } catch (Exception e) {
            System.out.println("Failed to convert the message in plain text: " + e.getMessage());
        }
        return null;
    }
}
