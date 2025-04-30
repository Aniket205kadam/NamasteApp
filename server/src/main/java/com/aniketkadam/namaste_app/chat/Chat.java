package com.aniketkadam.namaste_app.chat;

import com.aniketkadam.namaste_app.common.BaseAuditingEntity;
import com.aniketkadam.namaste_app.message.Message;
import com.aniketkadam.namaste_app.message.MessageState;
import com.aniketkadam.namaste_app.message.MessageType;
import com.aniketkadam.namaste_app.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Entity
@Table(name = "chats")
@NamedQuery(
        name = ChatConstants.FIND_CHAT_BY_SENDER_ID,
        query = """
                SELECT DISTINCT chat
                FROM Chat chat
                WHERE chat.sender.id = :senderId
                OR chat.recipient.id = :senderId
                ORDER BY createdDate DESC
                """
)
@NamedQuery(
        name = ChatConstants.FIND_CHAT_BY_SENDER_ID_AND_RECEIVER_Id,
        query = """
                SELECT DISTINCT chat
                FROM Chat chat
                WHERE (chat.sender.id = :senderId AND chat.recipient.id = :recipientId)
                OR (chat.sender.id = :recipientId AND chat.recipient.id = :senderId)
                ORDER BY createdDate DESC
                """
)
public class Chat extends BaseAuditingEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    @ManyToOne
    @JoinColumn(name = "sender_id")
    private User sender;
    @ManyToOne
    @JoinColumn(name = "recipient_id")
    private User recipient;
    @OneToMany(mappedBy = "chat", fetch = FetchType.EAGER)
    @OrderBy("createdDate DESC")
    private List<Message> messages;

    @Transient
    public String getChatName(String senderId) {
        if (recipient.getId().equals(senderId)) {
            return sender.getFirstname() + " " + sender.getLastname();
        }
        return recipient.getFirstname() + " " + recipient.getLastname();
    }

    @Transient
    public String getTargetChatName(String senderId) {
        if (sender.getId().equals(senderId)) {
            return sender.getFirstname() + " " + sender.getLastname();
        }
        return recipient.getFirstname() + " " + recipient.getLastname();
    }

    @Transient
    public long getUnreadMessages(String senderId) {
        return messages.stream()
                .filter(m -> m.getReceiverId().equals(senderId))
                .filter(m -> m.getState() != MessageState.SEEN)
                .count();
    }

    @Transient
    public String getLastMessage() {
        if (messages != null && !messages.isEmpty()) {
            if (messages.getFirst().getType() != MessageType.TEXT) {
                return "Attachment:" + messages.getFirst().getType();
            }
        }
        return null; // no messages available
    }

    @Transient
    public LocalDateTime getLastMessageTime() {
        if (messages != null && !messages.isEmpty()) {
            return messages.getFirst().getCreatedDate();
        }
        return null; // no messages available
    }
}
