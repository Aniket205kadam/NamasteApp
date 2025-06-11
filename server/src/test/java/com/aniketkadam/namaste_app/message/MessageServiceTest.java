package com.aniketkadam.namaste_app.message;

import com.aniketkadam.namaste_app.AES.AESService;
import com.aniketkadam.namaste_app.ai.AIService;
import com.aniketkadam.namaste_app.chat.Chat;
import com.aniketkadam.namaste_app.chat.ChatRepository;
import com.aniketkadam.namaste_app.exception.OperationNotPermittedException;
import com.aniketkadam.namaste_app.file.FileService;
import com.aniketkadam.namaste_app.notification.Notification;
import com.aniketkadam.namaste_app.notification.NotificationService;
import com.aniketkadam.namaste_app.user.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.Authentication;
import org.springframework.web.multipart.MultipartFile;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import java.io.IOException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

class MessageServiceTest {
    @InjectMocks
    private MessageService messageService;

    @Mock
    private ChatRepository chatRepository;
    @Mock
    private MessageRepository messageRepository;
    @Mock
    private NotificationService notificationService;
    @Mock
    private FileService fileService;
    @Mock
    private MessageMapper mapper;
    @Mock
    private AIService aiService;
    @Mock
    private AESService aesService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void saveMessageTest() throws NoSuchPaddingException, IllegalBlockSizeException, NoSuchAlgorithmException, BadPaddingException, InvalidKeyException {
        String encryptedContent = "encrypted-content";
        MessageRequest request = MessageRequest.builder()
                .content("hello")
                .senderId("user1")
                .receiverId("user2")
                .type(MessageType.TEXT)
                .chatId("chat123")
                .build();
        User user1 = User.builder()
                .id("user1")
                .firstname("firstname1")
                .lastname("lastname1")
                .build();
        User user2 = User.builder()
                .id("user2")
                .firstname("firstname2")
                .lastname("lastname2")
                .build();

        Chat chat = Chat.builder()
                .id("chat123")
                .messages(new ArrayList<>())
                .sender(user1)
                .recipient(user2)
                .build();
        Message message = Message.builder()
                .id(123L)
                .senderId("user1")
                .receiverId("user2")
                .chat(chat)
                .content(encryptedContent)
                .type(MessageType.TEXT)
                .state(MessageState.SENT)
                .build();
        MessageResponse expectedResponse = MessageResponse.builder()
                .id(123L)
                .build();
        when(chatRepository.findById("chat123")).thenReturn(Optional.of(chat));
        when(aiService.sendMessageForBot(request)).thenReturn(false);
        when(aesService.encrypt("hello")).thenReturn(encryptedContent);
        when(messageRepository.save(any(Message.class))).thenReturn(message);
        when(chatRepository.save(any(Chat.class))).thenReturn(chat);
        when(mapper.toMessageResponse(any(Message.class))).thenReturn(expectedResponse);

        MessageResponse actualResponse = messageService.saveMessage(request);

        assertEquals(123L, actualResponse.getId());
        verify(notificationService, times(1)).sendNotification(eq("user2"), any(Notification.class));
        verify(aiService, never()).generateResponseFromAI(any(), any());
    }

    @Test
    void uploadMediaMessageTest() {
        String chatId = "chat123";
        String caption = "This is caption";
        String senderId = "user1";
        String receiverId = "user2";
        String filePath = "/media/image.png";

        MultipartFile mockFile = mock(MultipartFile.class);
        when(mockFile.getOriginalFilename()).thenReturn("image.png");
        when(mockFile.getContentType()).thenReturn("image/png");

        User user = User.builder()
                .id(senderId)
                .build();
        Authentication authentication = mock(Authentication.class);
        when(authentication.getPrincipal()).thenReturn(user);

        Chat chat = Chat.builder()
                .id(chatId)
                .sender(user)
                .recipient(User.builder().id(receiverId).build())
                .build();
        Message message = Message.builder()
                .id(123L)
                .senderId(senderId)
                .receiverId(receiverId)
                .chat(chat)
                .mediaFilePath(filePath)
                .caption(caption)
                .fileOriginalName("image.png")
                .type(MessageType.IMAGE)
                .build();
        MessageResponse expectedResponse = MessageResponse.builder().id(123L).build();

        when(chatRepository.findById(chatId)).thenReturn(Optional.of(chat));
        when(fileService.saveFile(mockFile, senderId)).thenReturn(filePath);
        when(messageRepository.save(any(Message.class))).thenReturn(message);
        when(mapper.toMessageResponse(message)).thenReturn(expectedResponse);

        MessageResponse response = messageService.uploadMediaMessage(chatId, caption, mockFile, authentication);

        assertEquals(123L, response.getId());
        verify(notificationService, times(1)).sendNotification(eq(receiverId), any(Notification.class));
        verify(fileService, times(1)).saveFile(mockFile, senderId);
        verify(messageRepository, times(1)).save(any(Message.class));
    }

    @Test
    void setMessageToSeenTest() {
        String chatId = "chat123";
        String userId = "user1";
        String recipientId = "user2";

        User connectedUser = User.builder().id(userId).build();
        User recipient = User.builder().id(recipientId).build();

        Authentication authentication = mock(Authentication.class);
        when(authentication.getPrincipal()).thenReturn(connectedUser);

        Chat chat = Chat.builder()
                .id(chatId)
                .sender(connectedUser)
                .recipient(recipient)
                .build();
        when(chatRepository.findById(chatId)).thenReturn(Optional.of(chat));

        messageService.setMessageToSeen(chatId, authentication);

        verify(chatRepository, times(1)).findById(chatId);
        verify(messageRepository).setMessagesToSeenByChat(chatId, MessageState.SEEN, connectedUser.getId());
    }

    @Test
    void findChatMessagesTest() {
        String chatId = "chat123";

        Chat chat = Chat.builder()
                .id(chatId)
                .build();
        Message message1 = Message.builder()
                .id(1L)
                .chat(chat)
                .content("firstMessage")
                .type(MessageType.TEXT)
                .build();
        Message message2 = Message.builder()
                .id(2L)
                .chat(chat)
                .content("secondMessage")
                .type(MessageType.TEXT)
                .build();
        Message message3 = Message.builder()
                .id(3L)
                .chat(chat)
                .content("thirdMessage")
                .type(MessageType.TEXT)
                .build();
        List<Message> messages = List.of(message1, message2, message3);

        when(messageRepository.findMessagesByChatId(chatId)).thenReturn(messages);
        when(mapper.toMessageResponse(message1)).thenReturn(
                MessageResponse.builder()
                        .id(message1.getId())
                        .content(message1.getContent())
                        .type(message1.getType())
                        .build()
        );
        when(mapper.toMessageResponse(message2)).thenReturn(
                MessageResponse.builder()
                        .id(message2.getId())
                        .content(message2.getContent())
                        .type(message2.getType())
                        .build()
        );
        when(mapper.toMessageResponse(message3)).thenReturn(
                MessageResponse.builder()
                        .id(message3.getId())
                        .content(message3.getContent())
                        .type(message3.getType())
                        .build()
        );

        List<MessageResponse> messageResponses = messageService.findChatMessages(chatId);
        assertNotNull(messageResponses);
        assertEquals(messages.size(), messageResponses.size());
        verify(mapper, times(messageResponses.size())).toMessageResponse(any(Message.class));
        verify(messageRepository, times(1)).findMessagesByChatId(chatId);

    }

    @Test
    void findMessageByIdTest() {
        Long messageId = 123L;
        Message message = Message.builder()
                .id(messageId)
                .content("This is test message")
                .type(MessageType.TEXT)
                .build();
        when(messageRepository.findById(messageId)).thenReturn(Optional.of(message));
        when(mapper.toMessageResponse(message)).thenReturn(
                MessageResponse.builder()
                        .id(messageId)
                        .content(message.getContent())
                        .type(message.getType())
                        .build()
        );
        MessageResponse messageResponse = messageService.findMessageById(messageId);
        assertEquals(messageResponse.getId(), message.getId());
        assertEquals(messageResponse.getContent(), message.getContent());
        assertEquals(messageResponse.getType(), message.getType());
        verify(messageRepository, times(1)).findById(messageId);
        verify(mapper, times(1)).toMessageResponse(any(Message.class));
    }

    @Test
    void deleteMessageTest() throws IOException, OperationNotPermittedException {
        String chatId = "chat123";
        Long messageId = 1L;
        String userId = "user1";
        String receiverId = "user2";

        User connectedUser = User.builder()
                .id(userId)
                .firstname("firstname")
                .lastname("lastname")
                .email("test@gmail.com")
                .build();
        Authentication authentication = mock(Authentication.class);
        when(authentication.getPrincipal()).thenReturn(connectedUser);
        Message message = Message.builder()
                .id(messageId)
                .senderId(userId)
                .receiverId(receiverId)
                .type(MessageType.TEXT)
                .content("Hello World!")
                .isDeleted(false)
                .chat(Chat.builder().id(chatId).build())
                .build();
        Chat chat = Chat.builder()
                .id(chatId)
                .messages(List.of(message))
                .sender(connectedUser)
                .recipient(User.builder()
                        .id(receiverId)
                        .firstname("firstname2")
                        .lastname("lastname2")
                        .email("test2@gmail.com")
                        .build())
                .build();
        Message deletedMessage = Message.builder()
                .id(messageId)
                .senderId(userId)
                .receiverId(receiverId)
                .type(MessageType.TEXT)
                .isDeleted(true)
                .build();
        MessageResponse messageResponse = MessageResponse.builder().id(messageId).build();

        when(chatRepository.findById(chatId)).thenReturn(Optional.of(chat));
        when(messageRepository.findById(messageId)).thenReturn(Optional.of(message));
        when(messageRepository.save(any(Message.class))).thenReturn(deletedMessage);
        when(mapper.toMessageResponse(deletedMessage)).thenReturn(messageResponse);

        MessageResponse result = messageService.deleteMessage(chatId, messageId, authentication);

        assertNotNull(result);
        assertEquals(messageId, result.getId());
        assertTrue(message.getContent() == null);
        verify(notificationService, times(1)).sendNotification(eq(receiverId), any(Notification.class));
        verify(messageRepository, times(1)).save(message);

    }

    @Test
    void getTotalUnreadMessagesTest() {
        User user = User.builder()
                .id(String.valueOf(UUID.randomUUID()))
                .firstname("firstname")
                .lastname("lastname")
                .email("test@gmail.com")
                .password("encrypted-password")
                .build();
        Authentication authentication = mock(Authentication.class);

        Message message1 = Message.builder()
                .id(1L)
                .state(MessageState.SENT)
                .build();
        Message message2 = Message.builder()
                .id(2L)
                .state(MessageState.SENT)
                .build();
        Message message3 = Message.builder()
                .id(3L)
                .state(MessageState.SENT)
                .build();

        List<Message> messages = List.of(message1, message2, message3);
        when(authentication.getPrincipal()).thenReturn(user);
        when(messageRepository.findTotalUnreadMessages(user.getId(), MessageState.SENT)).thenReturn(messages);

        int unreadMsgCount = messageService.getTotalUnreadMessages(authentication);

        assertEquals(unreadMsgCount, messages.size());
        verify(authentication, times(1)).getPrincipal();
        verify(messageRepository, times(1)).findTotalUnreadMessages(user.getId(), MessageState.SENT);
    }
}