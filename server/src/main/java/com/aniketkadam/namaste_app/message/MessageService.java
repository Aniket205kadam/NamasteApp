package com.aniketkadam.namaste_app.message;

import com.aniketkadam.namaste_app.ai.AIService;
import com.aniketkadam.namaste_app.chat.Chat;
import com.aniketkadam.namaste_app.chat.ChatRepository;
import com.aniketkadam.namaste_app.exception.OperationNotPermittedException;
import com.aniketkadam.namaste_app.file.FileService;
import com.aniketkadam.namaste_app.file.FileUtils;
import com.aniketkadam.namaste_app.notification.Notification;
import com.aniketkadam.namaste_app.notification.NotificationService;
import com.aniketkadam.namaste_app.notification.NotificationType;
import com.aniketkadam.namaste_app.user.User;
import com.aniketkadam.namaste_app.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.ollama.OllamaChatModel;
import org.springframework.lang.NonNull;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageService {
    private static final Logger log = LoggerFactory.getLogger(MessageService.class);
    private final ChatRepository chatRepository;
    private final MessageRepository messageRepository;
    private final NotificationService notificationService;
    private final FileService fileService;
    private final MessageMapper mapper;
    private final AIService aiService;

    @Transactional
    public MessageResponse saveMessage(MessageRequest request) {
        Chat chat = chatRepository.findById(request.getChatId())
                .orElseThrow(() -> new EntityNotFoundException("Chat with Id: " + request.getChatId() + " not found"));

        Message savedMessage = null;

        if (aiService.sendMessageForBot(request)) {
            Message message = Message.builder()
                    .content(request.getContent())
                    .chat(chat)
                    .senderId(request.getSenderId())
                    .receiverId(request.getReceiverId())
                    .type(request.getType())
                    .state(MessageState.SEEN)
                    .gifUrl(request.getGifUrl())
                    .replyId(request.getReplyId())
                    .build();
            savedMessage = messageRepository.save(message);
            chat.getMessages().add(savedMessage);
            chatRepository.save(chat);

            // if this message for bot then we are forward this to bot
            aiService.generateResponseFromAI(request, savedMessage);
        } else {
            Message message = Message.builder()
                    .content(request.getContent())
                    .chat(chat)
                    .senderId(request.getSenderId())
                    .receiverId(request.getReceiverId())
                    .type(request.getType())
                    .state(MessageState.SENT)
                    .gifUrl(request.getGifUrl())
                    .replyId(request.getReplyId())
                    .build();
            savedMessage = messageRepository.save(message);
            chat.getMessages().add(savedMessage);
            chatRepository.save(chat);

            // send notification to the receiver
            Notification notification = Notification.builder()
                    .chatId(chat.getId())
                    .messageType(request.getType())
                    .content(request.getContent())
                    .senderId(request.getSenderId())
                    .receiverId(request.getReceiverId())
                    .message(mapper.toMessageResponse(savedMessage))
                    .type(NotificationType.MESSAGE)
                    .chatName(chat.getTargetChatName(message.getSenderId()))
                    .build();
            notificationService.sendNotification(request.getReceiverId(), notification);
        }
        return mapper.toMessageResponse(savedMessage);
    }

    private MessageType getFileType(MultipartFile file) {
        if (file.getContentType().startsWith("image/"))
            return MessageType.IMAGE;
        else if (file.getContentType().startsWith("video/"))
            return MessageType.VIDEO;
        else if (file.getContentType().startsWith("audio/"))
            return MessageType.AUDIO;
        else
            return MessageType.UNKNOWN;
    }

    private NotificationType getFileTypeForNotification(MultipartFile file) {
        if (file.getContentType().startsWith("image/"))
            return NotificationType.IMAGE;
        else if (file.getContentType().startsWith("video/"))
            return NotificationType.VIDEO;
        else if (file.getContentType().startsWith("audio/"))
            return NotificationType.AUDIO;
        else
            return NotificationType.MESSAGE;
    }

    @Transactional
    public MessageResponse uploadMediaMessage(String chatId, String caption, MultipartFile file, Authentication connectedUser) {
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
                .type(getFileType(file))
                .mediaFilePath(filePath)
                .caption(caption)
                .fileOriginalName(file.getOriginalFilename())
                .chat(chat)
                .build();
        var savedMessage = messageRepository.save(message);
        Notification notification = Notification.builder()
                .chatId(chat.getId())
                .type(getFileTypeForNotification(file))
                .senderId(senderId)
                .receiverId(receiverId)
                .messageType(getFileType(file))
                .media(FileUtils.readFileFromDestination(filePath))
                .build();
        notificationService.sendNotification(receiverId, notification);
        return mapper.toMessageResponse(savedMessage);
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
        User user = (User) connectedUser.getPrincipal();
        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new EntityNotFoundException("Chat with Id: " + chatId + " was not found"));
        final String recipientId = getRecipient(chat, user);
        messageRepository.setMessagesToSeenByChat(chat.getId(), MessageState.SEEN, user.getId());
        Notification notification = Notification.builder()
                .chatId(chat.getId())
                .type(NotificationType.SEEN)
                .receiverId(recipientId)
                .senderId(getSenderId(chat, user))
                .build();
        notificationService.sendNotification(recipientId, notification);
        // also send notification to current user
        notificationService.sendNotification(user.getId(), notification);
    }

    public List<MessageResponse> findChatMessages(String chatId) {
        return messageRepository.findMessagesByChatId(chatId)
                .stream()
                .map(mapper::toMessageResponse)
                .toList();
    }

    public MessageResponse findMessageById(@NonNull Long messageId) {
        var message = messageRepository.findById(messageId)
                .orElseThrow(() -> new EntityNotFoundException("Message with " + messageId + " not found"));
        return mapper.toMessageResponse(message);
    }

    @Transactional
    public MessageResponse deleteMessage(
            @NonNull String chatId,
            @NonNull Long messageId,
            @NonNull Authentication connectedUser
    ) throws OperationNotPermittedException, IOException {
        var user = (User) connectedUser.getPrincipal();
        var chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new EntityNotFoundException("Chat with ID: " + chatId + " not found"));
        var message = messageRepository.findById(messageId)
                .orElseThrow(() -> new EntityNotFoundException("Message with ID: " + messageId + " not found"));
        var isMsgExistInChat = chat.getMessages()
                .stream()
                .anyMatch(msg -> msg.getId().equals(message.getId()));
        if (!isMsgExistInChat) {
            throw new OperationNotPermittedException("Message is not exist in current chat");
        }
        // Delete message from both side because current user has own message
        if (message.getSenderId().equals(user.getId())) {
            if (message.getType() == MessageType.TEXT || message.getType() == MessageType.GIF) {
                message.setContent(null);
                message.setGifUrl(null);
            } else {
                // delete the media
                String filePath = message.getMediaFilePath();
                Files.delete(Paths.get(filePath));
                log.info("Delete the file on {} path", filePath);
                message.setMediaFilePath(null);
            }
            message.setIsDeleted(true);
            var savedMessage = messageRepository.save(message);

            // send notification
            Notification notification = Notification.builder()
                    .chatId(chat.getId())
                    .messageType(message.getType())
                    .content(message.getContent())
                    .senderId(message.getSenderId())
                    .receiverId(message.getReceiverId())
                    .message(mapper.toMessageResponse(savedMessage))
                    .type(NotificationType.MESSAGE)
                    .chatName(chat.getTargetChatName(message.getSenderId()))
                    .build();
            notificationService.sendNotification(savedMessage.getReceiverId(), notification);

            return mapper.toMessageResponse(savedMessage);
        }
        // Delete message only from the receiver side
        else {
            message.setIsDeletedFromReceiver(true);
            var savedMessage = messageRepository.save(message);

            // send notification
            Notification notification = Notification.builder()
                    .chatId(chat.getId())
                    .messageType(message.getType())
                    .content(message.getContent())
                    .senderId(message.getSenderId())
                    .receiverId(message.getReceiverId())
                    .message(mapper.toMessageResponse(savedMessage))
                    .type(NotificationType.MESSAGE)
                    .chatName(chat.getTargetChatName(message.getSenderId()))
                    .build();
            notificationService.sendNotification(savedMessage.getReceiverId(), notification);

            return mapper.toMessageResponse(savedMessage);
        }

    }

    public int getTotalUnreadMessages(Authentication connectedUser) {
        var user = (User) connectedUser.getPrincipal();
        return messageRepository.findTotalUnreadMessages(user.getId(), MessageState.SENT)
                .size();
    }
}
