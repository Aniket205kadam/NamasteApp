package com.aniketkadam.namaste_app.message;

import com.aniketkadam.namaste_app.chat.Chat;
import com.aniketkadam.namaste_app.common.BaseAuditingEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Entity
@Table(name = "messages")
@NamedQuery(
        name = MessageConstants.FIND_MESSAGES_BY_CHAT_ID,
        query = """
                SELECT message FROM Message message
                WHERE message.chat.id = :chatId ORDER BY message.createdDate
                """
)
@NamedQuery(
        name = MessageConstants.SET_MESSAGES_TO_SEEN_BY_CHAT,
        query = "UPDATE Message SET state = :newState where chat.id = :chatId AND receiverId = :receiverId"
)
@NamedQuery(
        name = MessageConstants.FIND_TOTAL_UNREAD_MESSAGES,
        query = "SELECT message FROM Message message WHERE message.receiverId = :userId AND message.state = :state"
)
public class Message extends BaseAuditingEntity {

    @Id
    @SequenceGenerator(name = "msg_seq", sequenceName = "msg_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "msg_seq")
    private Long id;
    @Column(columnDefinition = "TEXT")
    private String content;
    @Enumerated(EnumType.STRING)
    private MessageState state;
    @Enumerated(EnumType.STRING)
    private MessageType type;
    @ManyToOne
    @JoinColumn(name = "chat_id")
    private Chat chat;
    @Column(name = "sender_id", nullable = false)
    private String senderId;
    @Column(name = "receiver_id", nullable = false)
    private String receiverId;
    private String mediaFilePath;
    @Column(columnDefinition = "TEXT")
    private String caption;
    @Column(columnDefinition = "TEXT")
    private String gifUrl;
    @Column(columnDefinition = "TEXT")
    private String fileOriginalName;
    private String replyId;

    private Boolean isDeleted;
    private Boolean isDeletedFromReceiver;
}
