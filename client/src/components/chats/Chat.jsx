import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

function Chat({ chat }) {
  return (
    <div className="chat" key={chat.id}>
      <div className="profile">
        <img src={chat.avtar} alt={chat.name} />
      </div>
      <div className="info">
        <div className="name">
          <span>{chat.name}</span>
        </div>
        <div className="last-msg-time">
          <span>{chat.lastMsgTime}</span>
        </div>
        <div className="last-msg">
          <span>{chat.lastMsg}</span>
        </div>
        {chat.unread > 0 && (
          <div className="unread-msg">
            <span>{chat.unread}</span>
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
