package com.aniketkadam.namaste_app.message;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    @Query(name = MessageConstants.FIND_MESSAGES_BY_CHAT_ID)
    List<Message> findMessagesByChatId(@Param("chatId") String chatId);

    @Query(name = MessageConstants.SET_MESSAGES_TO_SEEN_BY_CHAT)
    @Modifying
    void setMessagesToSeenByChat(
            @Param("chatId") String chatId,
            @Param("newState") MessageState state,
            @Param("receiverId") String receiverId
    );

    @Query(name = MessageConstants.FIND_TOTAL_UNREAD_MESSAGES)
    List<Message> findTotalUnreadMessages(@Param("userId") String userId, @Param("state") MessageState state);

    @Query(name = MessageConstants.FIND_CHAT_MEDIAS)
    List<Message> findChatMedias(@Param("chatId") String chatId, @Param("image") MessageType image, @Param("video") MessageType video);
}
