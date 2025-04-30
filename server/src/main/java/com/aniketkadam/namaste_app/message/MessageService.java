package com.aniketkadam.namaste_app.message;

import com.aniketkadam.namaste_app.chat.Chat;
import com.aniketkadam.namaste_app.chat.ChatRepository;
import com.aniketkadam.namaste_app.file.FileService;
import com.aniketkadam.namaste_app.file.FileUtils;
import com.aniketkadam.namaste_app.notification.Notification;
import com.aniketkadam.namaste_app.notification.NotificationService;
import com.aniketkadam.namaste_app.notification.NotificationType;
import com.aniketkadam.namaste_app.user.User;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageService {
    private final ChatRepository chatRepository;
    private final MessageRepository messageRepository;
    private final NotificationService notificationService;
    private final FileService fileService;
    private final MessageMapper mapper;

    @Transactional
    public void saveMessage(MessageRequest request) {
        Chat chat = chatRepository.findById(request.getChatId())
                .orElseThrow(() -> new EntityNotFoundException("Chat with Id: " + request.getChatId() + " not found"));
        Message message = Message.builder()
                .content(request.getContent())
                .chat(chat)
                .senderId(request.getSenderId())
                .receiverId(request.getReceiverId())
                .type(request.getType())
                .state(MessageState.SENT)
                .build();
        messageRepository.save(message);

        Notification notification = Notification.builder()
                .chatId(chat.getId())
                .messageType(request.getType())
                .content(request.getContent())
                .senderId(request.getSenderId())
                .receiverId(request.getReceiverId())
                .type(NotificationType.MESSAGE)
                .chatName(chat.getTargetChatName(message.getSenderId()))
                .build();
        notificationService.sendNotification(request.getReceiverId(), notification);
    }

    @Transactional
    public void uploadMediaMessage(String chatId, MultipartFile file, Authentication connectedUser) {
        User user = (User) connectedUser.getPrincipal();
        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new EntityNotFoundException("Chat with Id: " + chatId + " not found"));
        final String senderId = getSenderId(chat, user);
        final String receiverId = getRecipient(chat, user);
        final String filePath = fileService.saveFile(file, senderId);
        Message message = Message.builder()
                .receiverId(receiverId)
                .senderId(senderId)
                .state(MessageState.SENT)
                .type(MessageType.IMAGE)
                .mediaFilePath(filePath)
                .chat(chat)
                .build();
        messageRepository.save(message);
        Notification notification = Notification.builder()
                .chatId(chat.getId())
                .type(NotificationType.IMAGE)
                .senderId(senderId)
                .receiverId(receiverId)
                .messageType(MessageType.IMAGE)
                .media(FileUtils.readFileFromDestination(filePath))
                .build();
        notificationService.sendNotification(receiverId, notification);
    }

    private String getRecipient(Chat chat, User user) {
        if (chat.getSender().getId().equals(user.getId())) {
            return chat.getRecipient().getId();
        }
        return chat.getSender().getId();
    }

    private String getSenderId(Chat chat, User user) {
        if (chat.getSender().getId().equals(user.getId())) {
            return chat.getSender().getId();
        }
        return chat.getRecipient().getId();
    }

    @Transactional
    public void setMessageToSeen(String chatId, Authentication connectedUser) {
        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new EntityNotFoundException("Chat with Id: " + chatId + " was not found"));
        final String recipientId = getRecipient(chat, (User) connectedUser.getPrincipal());
        messageRepository.setMessagesToSeenByChat(chat.getId(), MessageState.SEEN);
        Notification notification = Notification.builder()
                .chatId(chat.getId())
                .type(NotificationType.SEEN)
                .receiverId(recipientId)
                .senderId(getSenderId(chat, (User) connectedUser.getPrincipal()))
                .build();
        notificationService.sendNotification(recipientId, notification);
    }

    public List<MessageResponse> findChatMessages(String chatId) {
        return messageRepository.findMessagesByChatId(chatId)
                .stream()
                .map(mapper::toMessageResponse)
                .toList();
    }
}
