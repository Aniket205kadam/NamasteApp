import {
  faArrowRight,
  faArrowRightArrowLeft,
  faEllipsisVertical,
  faMagnifyingGlass,
  faMicrophone,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import Message from "./Message";
import "../../styles/ChatWindow.css";

// Fake chat data
const fakeChat = {
  id: 1,
  name: "John Doe",
  avatar: "https://randomuser.me/api/portraits/men/1.jpg",
  status: "online",
  lastSeen: "10:15 AM",
};

// Fake messages data
const fakeMessages = [
  {
    id: 1,
    content: "Hey, how are you?",
    type: "TEXT",
    isOwn: false,
    time: "9:30 AM",
    status: "delivered",
  },
  {
    id: 2,
    content: "I'm good, thanks! How about you?",
    type: "TEXT",
    isOwn: true,
    time: "9:31 AM",
    status: "read",
  },
  {
    id: 3,
    content:
      "https://images.pexels.com/photos/31838686/pexels-photo-31838686/free-photo-of-romantic-black-and-white-portrait-of-a-young-couple.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
    type: "IMAGE",
    isOwn: false,
    time: "9:32 AM",
    status: "delivered",
  },
  {
    id: 4,
    content: "Check out this view!",
    type: "TEXT",
    isOwn: false,
    time: "9:33 AM",
    status: "delivered",
  },
  {
    id: 5,
    content: "Wow, that's amazing!",
    type: "TEXT",
    isOwn: true,
    time: "9:34 AM",
    status: "sent",
  },
];

function ChatWindow() {
  const [chat] = useState(fakeChat);
  const [messages] = useState(fakeMessages);
  const [msg, setMsg] = useState("");

  return (
    <div className="chat-window">
      <div className="chat-window__header">
        <div className="chat-window__profile">
          <img
            src={chat.avatar}
            alt={chat.name}
            className="chat-window__avatar"
          />
          <div className="chat-window__info">
            <span className="chat-window__name">{chat.name}</span>
            <span className="chat-window__status">{chat.status}</span>
          </div>
        </div>
        <div className="chat-window__actions">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="chat-window__icon"
          />
          <FontAwesomeIcon
            icon={faEllipsisVertical}
            className="chat-window__icon"
          />
        </div>
      </div>

      <div className="chat-window__messages">
        {messages.map((message) => (
          <Message
            message={message}
            key={message.id}
            isOwnMessage={message.isOwn}
          />
        ))}
      </div>

      <div className="chat-window__input">
        <FontAwesomeIcon icon={faPlus} className="chat-window__input-icon" />
        <div className="chat-window__input-container">
          <input
            type="text"
            placeholder="Type a message"
            className="chat-window__input-field"
            value={msg}
            onChange={(event) => setMsg(event.target.value)}
          />
          {msg.length === 0 ? (
            <FontAwesomeIcon
              icon={faMicrophone}
              className="chat-window__input-icon"
            />
          ) : (
            <FontAwesomeIcon icon={faArrowRight} />
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatWindow;
