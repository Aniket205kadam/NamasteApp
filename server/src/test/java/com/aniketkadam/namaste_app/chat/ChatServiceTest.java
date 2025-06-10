package com.aniketkadam.namaste_app.chat;

import com.aniketkadam.namaste_app.user.User;
import com.aniketkadam.namaste_app.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.Authentication;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

class ChatServiceTest {
    @InjectMocks
    private ChatService chatService;

    @Mock
    private ChatRepository chatRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private ChatMapper mapper;
    @Mock
    private Authentication authentication;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void createChatTest() {
        String senderId = String.valueOf(UUID.randomUUID());
        String receiverId = String.valueOf(UUID.randomUUID());
        User sender = User.builder()
                .id(senderId)
                .build();
        User receiver = User.builder()
                .id(receiverId)
                .build();
        String dbChatId = String.valueOf(UUID.randomUUID());
        Chat newChat = Chat.builder()
                .id(dbChatId)
                .sender(sender)
                .recipient(receiver)
                .build();
        when(chatRepository.findChatsBySenderIdAndReceiverId(senderId, receiverId)).thenReturn(Optional.empty());
        when(userRepository.findById(senderId)).thenReturn(Optional.of(sender));
        when(userRepository.findById(receiverId)).thenReturn(Optional.of(receiver));
        when(chatRepository.save(any(Chat.class))).thenReturn(newChat);

        String chatId = chatService.createChat(senderId, receiverId);

        assertEquals(dbChatId, chatId);
        verify(chatRepository, times(1)).findChatsBySenderIdAndReceiverId(senderId, receiverId);
        verify(userRepository, times(1)).findById(senderId);
        verify(userRepository, times(1)).findById(receiverId);
        verify(chatRepository, times(1)).save(any(Chat.class));
    }

    @Test
    public void getChatsByUserTest() {
        User user = User.builder()
                .id(String.valueOf(UUID.randomUUID()))
                .firstname("firstname")
                .lastname("lastname")
                .email("test@gmail.com")
                .build();
        Chat chat1 = Chat.builder()
                .id(String.valueOf(UUID.randomUUID()))
                .sender(user)
                .build();
        Chat chat2 = Chat.builder()
                .id(String.valueOf(UUID.randomUUID()))
                .sender(user)
                .build();
        List<Chat> chats = List.of(chat1, chat2);
        ChatResponse chatResponse1 = ChatResponse.builder()
                .id(chat1.getId())
                .senderId(user.getId())
                .build();
        ChatResponse chatResponse2 = ChatResponse.builder()
                .id(chat2.getId())
                .senderId(user.getId())
                .build();

        when(authentication.getPrincipal()).thenReturn(user);
        when(mapper.toChatResponse(chat1, user.getId())).thenReturn(chatResponse1);
        when(mapper.toChatResponse(chat2, user.getId())).thenReturn(chatResponse2);
        when(chatRepository.findChatsBySenderId(user.getId())).thenReturn(chats);

        List<ChatResponse> result = chatService.getChatsByUser(authentication);

        assertEquals(chats.size(), result.size());
        assertEquals(chatResponse1, result.get(0));
        assertEquals(chatResponse2, result.get(1));
        verify(authentication, times(1)).getPrincipal();
        verify(chatRepository, times(1)).findChatsBySenderId(user.getId());
        verify(mapper, times(1)).toChatResponse(chat1, user.getId());
        verify(mapper, times(1)).toChatResponse(chat2, user.getId());
    }

    @Test
    public void getChatByIdTest() {
        String chatId = String.valueOf(UUID.randomUUID());
        User user = User.builder()
                .id(String.valueOf(UUID.randomUUID()))
                .firstname("firstname")
                .lastname("lastname")
                .email("test@gmail.com")
                .build();
        Chat chat = Chat.builder()
                .id(chatId)
                .sender(user)
                .recipient(User.builder()
                        .id(String.valueOf(UUID.randomUUID()))
                        .firstname("firstname1")
                        .lastname("lastname1")
                        .email("test2@gmail.com")
                        .build()
                )
                .build();
        ChatResponse chatResponse = ChatResponse.builder()
                .id(chat.getId())
                .senderId(chat.getSender().getId())
                .receiverId(chat.getRecipient().getId())
                .build();
        when(mapper.toChatResponse(chat, user.getId())).thenReturn(chatResponse);
        when(authentication.getPrincipal()).thenReturn(user);
        when(chatRepository.findById(chatId)).thenReturn(Optional.of(chat));

        ChatResponse existingChat = chatService.getChatById(chatId, authentication);

        assertEquals(existingChat, chatResponse);
        verify(mapper, times(1)).toChatResponse(chat, user.getId());
        verify(authentication, times(1)).getPrincipal();
        verify(chatRepository, times(1)).findById(chatId);
    }

    @Test
    public void getChatByTwoUser() {
        String userId1 = String.valueOf(UUID.randomUUID());
        String userId2 = String.valueOf(UUID.randomUUID());

        User user1 = User.builder()
                .id(userId1)
                .firstname("firstname1")
                .lastname("lastname1")
                .email("test1@gmail.com")
                .build();
        User user2 = User.builder()
                .id(userId2)
                .firstname("firstname2")
                .lastname("lastname2")
                .email("test2@gmail.com")
                .build();
        Chat chat1 = Chat.builder()
                .id(String.valueOf(UUID.randomUUID()))
                .sender(user1)
                .recipient(user2)
                .build();
        Chat chat2 = Chat.builder()
                .id(String.valueOf(UUID.randomUUID()))
                .sender(user2)
                .recipient(User.builder()
                        .id(String.valueOf(UUID.randomUUID()))
                        .firstname("firstname4")
                        .lastname("lastname4")
                        .email("test4@gmail.com")
                        .build())
                .build();
        Chat chat3 = Chat.builder()
                .id(String.valueOf(UUID.randomUUID()))
                .sender(user1)
                .recipient(User.builder()
                        .id(String.valueOf(UUID.randomUUID()))
                        .firstname("firstname3")
                        .lastname("lastname3")
                        .email("test3@gmail.com")
                        .build())
                .build();
        List<Chat> chats = List.of(chat1, chat2, chat3);

        when(chatRepository.findAll()).thenReturn(chats);

        String chatId = chatService.getChatByTwoUser(userId1, userId2);

        assertEquals(chatId, chat1.getId());
        verify(chatRepository, times(1)).findAll();
    }
}