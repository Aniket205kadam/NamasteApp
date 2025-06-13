package com.aniketkadam.namaste_app.chat;

import com.aniketkadam.namaste_app.file.FileService;
import com.aniketkadam.namaste_app.file.FileUtils;
import com.aniketkadam.namaste_app.message.Message;
import com.aniketkadam.namaste_app.message.MessageRepository;
import com.aniketkadam.namaste_app.message.MessageType;
import com.aniketkadam.namaste_app.user.User;
import com.aniketkadam.namaste_app.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatService {
    private final ChatRepository chatRepository;
    private final UserRepository userRepository;
    private final ChatMapper mapper;
    private final MessageRepository messageRepository;
    private final FileService fileService;

    public String createChat(
            @NonNull String senderId,
            @NonNull String receiverId
    ) {
        Optional<Chat> existingChat = chatRepository.findChatsBySenderIdAndReceiverId(senderId, receiverId);
        if (existingChat.isPresent()) {
            log.warn("User ID: {} tried to create a new chat, but it already exists. Existing chat ID: {}.",
                    senderId,
                    existingChat.get().getId()
            );
            return existingChat.get().getId();
        }
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new EntityNotFoundException("User with id: " + senderId + " not found"));
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new EntityNotFoundException("User with id: " + receiverId + " not found"));
        Chat chat = Chat.builder()
                .sender(sender)
                .recipient(receiver)
                .build();
        return chatRepository.save(chat).getId();
    }

    public List<ChatResponse> getChatsByUser(Authentication connectedUser) {
        User user = (User) connectedUser.getPrincipal();
        return chatRepository.findChatsBySenderId(user.getId())
                .stream()
                //.filter(chat -> !chat.getMessages().isEmpty())
                //.sorted(Comparator.comparing(Chat::getLastMessageTime))
                .map(chat -> mapper.toChatResponse(chat, user.getId()))
                .toList();
    }

    public ChatResponse getChatById(@NonNull String chatId, Authentication connectedUser) {
        return mapper.toChatResponse(chatRepository.findById(chatId)
                        .orElseThrow(() -> new EntityNotFoundException("Chat with Id: " + chatId + " not found")),
                ((User) connectedUser.getPrincipal()).getId()
        );
    }

    public String getChatByTwoUser(
            @NonNull String user1Id,
            @NonNull String user2Id
    ) {
        return chatRepository.findAll()
                .stream()
                .filter(c -> (
                        c.getSender().getId().equals(user1Id) && c.getRecipient().getId().equals(user2Id) ||
                                c.getSender().getId().equals(user2Id) && c.getRecipient().getId().equals(user1Id))
                )
                .toList()
                .getFirst()
                .getId();
    }

    private String toBase64Encoding(@NonNull Message message) {
        String mediaUrl = message.getMediaFilePath();
        if (message.getType().toString().equals("IMAGE")) {
            return "data:"
                    + message.getType().toString().toLowerCase()
                    + "/"
                    + mediaUrl.substring(mediaUrl.lastIndexOf(".") + 1)
                    + ";base64,"
                    + Base64.getEncoder().encodeToString(FileUtils.readFileFromDestination(mediaUrl));
        } else {
            String videoUrl = fileService.generateThumbnail(mediaUrl, message.getSenderId());
            return "data:"
                    + message.getType().toString().toLowerCase()
                    + "/"
                    + mediaUrl.substring(mediaUrl.lastIndexOf(".") + 1)
                    + ";base64,"
                    + Base64.getEncoder().encodeToString(FileUtils.readFileFromDestination(videoUrl));
        }
    }

    public List<String> getChatRecentlyMedia(String chatId, Integer count, Authentication connectedUser) {
        User user = (User) connectedUser.getPrincipal();
        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new EntityNotFoundException("Chat with Id: " + chatId + " not found."));
        if (chat.getSender().getId().equals(user.getId()) || chat.getRecipient().getId().equals(user.getId())) {
            List<Message> mediaMessages = messageRepository.findChatMedias(chatId, MessageType.IMAGE, MessageType.VIDEO);
            List<String> mediaEncodedImage = mediaMessages.stream()
                    .map(this::toBase64Encoding)
                    .toList();
            return mediaEncodedImage;
        }
        return new ArrayList<>();
    }
}
