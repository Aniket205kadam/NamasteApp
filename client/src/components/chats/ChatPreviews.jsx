import {
  faEllipsisVertical,
  faLock,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import Chat from "./Chat";
import "../../styles/ChatPreviews.css";

const chatData = [
    {
      id: 1,
      name: "Alice Sharma",
      avtar: "https://i.pravatar.cc/150?img=1",
      lastMsg: "Hey! Are we meeting today?",
      lastMsgTime: "10:15 AM",
      unread: 2,
    },
    {
      id: 2,
      name: "Ravi Kumar",
      avtar: "https://i.pravatar.cc/150?img=2",
      lastMsg: "Got the files. Thanks!",
      lastMsgTime: "09:40 AM",
      unread: 0,
    },
    {
      id: 3,
      name: "Priya Mehta",
      avtar: "https://i.pravatar.cc/150?img=3",
      lastMsg: "I'll be a bit late today.",
      lastMsgTime: "Yesterday",
      unread: 5,
    },
    {
      id: 4,
      name: "John D'Souza",
      avtar: "https://i.pravatar.cc/150?img=4",
      lastMsg: "Okay, see you!",
      lastMsgTime: "Monday",
      unread: 1,
    },
  ];
  

function ChatPreviews() {
  const [chats, setChats] = useState(chatData);

  return (
    <div className="chat-previews">
      <div className="heading">
        <h1>Chats</h1>
        <div className="options">
          <div className="create-chat">
            <svg
              viewBox="0 0 24 24"
              height="24"
              width="24"
              preserveAspectRatio="xMidYMid meet"
              class
              fill="none"
            >
              <path
                d="M9.53277 12.9911H11.5086V14.9671C11.5086 15.3999 11.7634 15.8175 12.1762 15.9488C12.8608 16.1661 13.4909 15.6613 13.4909 15.009V12.9911H15.4672C15.9005 12.9911 16.3181 12.7358 16.449 12.3226C16.6659 11.6381 16.1606 11.0089 15.5086 11.0089H13.4909V9.03332C13.4909 8.60007 13.2361 8.18252 12.8233 8.05119C12.1391 7.83391 11.5086 8.33872 11.5086 8.991V11.0089H9.49088C8.83941 11.0089 8.33411 11.6381 8.55097 12.3226C8.68144 12.7358 9.09947 12.9911 9.53277 12.9911Z"
                fill="currentColor"
              ></path>
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M0.944298 5.52617L2.99998 8.84848V17.3333C2.99998 18.8061 4.19389 20 5.66665 20H19.3333C20.8061 20 22 18.8061 22 17.3333V6.66667C22 5.19391 20.8061 4 19.3333 4H1.79468C1.01126 4 0.532088 4.85997 0.944298 5.52617ZM4.99998 8.27977V17.3333C4.99998 17.7015 5.29845 18 5.66665 18H19.3333C19.7015 18 20 17.7015 20 17.3333V6.66667C20 6.29848 19.7015 6 19.3333 6H3.58937L4.99998 8.27977Z"
                fill="currentColor"
              ></path>
            </svg>
          </div>
          <div className="more">
            <FontAwesomeIcon icon={faEllipsisVertical} />
          </div>
        </div>
      </div>
      <div className="search-section">
        <div className="search">
          <FontAwesomeIcon icon={faMagnifyingGlass} />
          <input type="text" placeholder="Search" />
        </div>
        <div className="search-options">
          <div className="option">
            <span className="selected">All</span>
          </div>
          <div className="option">
            <span>Unread</span>
          </div>
          <div className="option">
            <span>Favourites</span>
          </div>
          <div className="option">
            <span>Groups</span>
          </div>
        </div>
      </div>
      <div className="chats">
        {chats.map((chat) => (
          <Chat chat={chat} key={chat.id} />
        ))}
      </div>
      <div className="bottom-info">
        <span className="secure-info">
            <FontAwesomeIcon icon={faLock} /> {" "}
            Your personal messages are <span style={{ fontWeight: "bold", color: "#21c063"}}>end-to-end encrypted</span>
        </span>
      </div>
    </div>
  );
}

export default ChatPreviews;
