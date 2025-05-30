package com.aniketkadam.namaste_app.chat;

import com.aniketkadam.namaste_app.user.User;
import com.aniketkadam.namaste_app.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatService {
    private final ChatRepository chatRepository;
    private final UserRepository userRepository;
    private final ChatMapper mapper;

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
}
