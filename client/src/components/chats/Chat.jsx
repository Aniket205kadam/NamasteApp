import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import NoProfile from "../../assets/no-profile.png";
import useNotificationTimeConvertor from "../../hooks/useNotificationTimeConvertor";

function Chat({ chat, setCurrentChat }) {
  return (
    <div className="chat" key={chat.id} onClick={() => setCurrentChat(chat.id)}>
      <div className="profile">
        <img src={chat.avtar || NoProfile} alt={chat.name} />
      </div>
      <div className="info">
        <div className="name">
          <span>{chat.name}</span>
        </div>
        <div className="info-msg">
          <div className="last-msg">
            <span>{chat.lastMessage}</span>
          </div>
          <div className="last-msg-time">
            <span>{useNotificationTimeConvertor(chat.lastMessageTime)}</span>
          </div>
        </div>
        {chat.unreadCount > 0 && (
          <div className="unread-msg">
            <span>{chat.unreadCount}</span>
          </div>
        )}
        <div className="chat-actions">
          <FontAwesomeIcon icon={faChevronDown} />
        </div>
      </div>
    </div>
  );
}

export default Chat;
