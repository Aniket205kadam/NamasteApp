package com.aniketkadam.namaste_app.ai;

import com.aniketkadam.namaste_app.chat.Chat;
import com.aniketkadam.namaste_app.chat.ChatRepository;
import com.aniketkadam.namaste_app.message.*;
import com.aniketkadam.namaste_app.notification.Notification;
import com.aniketkadam.namaste_app.notification.NotificationService;
import com.aniketkadam.namaste_app.notification.NotificationType;
import com.aniketkadam.namaste_app.user.User;
import com.aniketkadam.namaste_app.user.UserMapper;
import com.aniketkadam.namaste_app.user.UserRepository;
import com.aniketkadam.namaste_app.user.UserResponse;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.messages.AbstractMessage;
import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.ollama.OllamaChatModel;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AIService {
    private final UserRepository userRepository;
    private final UserMapper mapper;
    private final ChatRepository chatRepository;
    private final OllamaChatModel chatModel;
    private final MessageRepository messageRepository;
    private final MessageMapper messageMapper;
    private final NotificationService notificationService;

    public UserResponse findAIBot() {
        final String sub = System.getenv("AI_BOT_ID");
        User user = userRepository.findBySub(sub)
                .orElseThrow(() -> new EntityNotFoundException("AI Bot not found"));
        return mapper.toUserResponse(user);
    }

    @Async
    public void generateResponseFromAI(MessageRequest request, Message userSendMessage) {
        String botSub = System.getenv("AI_BOT_ID");
        User bot = userRepository.findBySub(botSub)
                .orElseThrow(() -> new EntityNotFoundException("AI Bot is not created yet."));
        User reciverUser = userRepository.findById(request.getSenderId())
                .orElseThrow(() -> new EntityNotFoundException("User with ID: " + request.getSenderId() + " not found"));
        Chat chat = chatRepository.findById(request.getChatId())
                .orElseThrow(() -> new EntityNotFoundException("Chat with " + request.getChatId() + " not found"));

        String systemMsg = String.format(
                """
                You are NamasteApp AI — a smart and friendly assistant created to help users with anything they need, from learning to daily productivity.
            
                You're now in a private chat with **%s**.
                Make them feel heard and welcomed, like ChatGPT would.
            
                Personality & Rules:
                - Always be helpful, polite, and interactive
                - Use clear and simple language, explain things with examples when needed
                - Always ask a follow-up question after giving a response (like "Would you like to know more?" or "Should I explain that with an example?")
                - Match the user's tone — friendly, serious, curious, or playful
                - Be direct and warm, never robotic
                - It's okay to use light humor or emojis where appropriate 😊
            
                Your name is NamasteApp AI — you *can* mention you're an assistant created by NamasteApp
                Don't mention you're a bot unless the user asks
            
                Begin the conversation by greeting %s, introducing yourself as NamasteApp AI, and asking what they’d like help with today.
                Don't ask again How can I help you today?, You talk like the user friend, not like the assistant
                """,
                reciverUser.getName(),
                reciverUser.getName()
        );
        List<Message> previousMessages = chat.getMessages();

        SystemMessage systemMessage = new SystemMessage(systemMsg);
        List<AbstractMessage> conversationMessages = previousMessages.stream()
                .map(msg -> msg.getSenderId().equals(bot.getId())
                        ? (AbstractMessage) new AssistantMessage(msg.getContent())
                        : (AbstractMessage) new UserMessage(msg.getContent()))
                .collect(Collectors.toList());

        // add the latest user message explicitly -> transaction timing
        conversationMessages.add(new UserMessage(userSendMessage.getContent()));

        List<org.springframework.ai.chat.messages.Message> allMessages = new ArrayList<>();
        allMessages.add(systemMessage);
        allMessages.addAll(conversationMessages);

        Prompt prompt = new Prompt(allMessages);
        ChatResponse botResponse = null;

        int count = 0;
        do {
            botResponse = chatModel.call(prompt);
            count++;
        } while (botResponse.getResult().getOutput().getText().isEmpty() && count < 5);

        // save the bot response db
        Message message = Message.builder()
                .content(botResponse.getResult().getOutput().getText())
                .chat(chat)
                .senderId(bot.getId())
                .receiverId(request.getSenderId())
                .type(MessageType.TEXT)
                .state(MessageState.SENT)
                .build();
        Message savedMessage = messageRepository.save(message);
        chat.getMessages().add(savedMessage);
        chatRepository.save(chat);

        // send notification to the user
        Notification notification = Notification.builder()
                .chatId(chat.getId())
                .messageType(MessageType.TEXT)
                .content(savedMessage.getContent())
                .senderId(savedMessage.getSenderId())
                .receiverId(savedMessage.getReceiverId())
                .message(messageMapper.toMessageResponse(savedMessage))
                .type(NotificationType.MESSAGE)
                .chatName(chat.getTargetChatName(message.getSenderId()))
                .build();
        notificationService.sendNotification(savedMessage.getReceiverId(), notification);
    }


    public boolean sendMessageForBot(MessageRequest request) {
        String botSub = System.getenv("AI_BOT_ID");
        User bot = userRepository.findBySub(botSub)
                .orElseThrow(() -> new EntityNotFoundException("Bot is not create yet."));
        return request.getReceiverId().equals(bot.getId());
    }
}
