import {
  faEllipsisVertical,
  faLock,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import Chat from "./Chat";
import "../../styles/ChatPreviews.css";
import ChatLoading from "../animation/ChatLoading";
import chatService from "../../service/ChatService";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

function ChatPreviews({ openCreateChatPage, setCurrentChat }) {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const connectedUser = useSelector((state) => state.authentication);
  const stompClient = useRef(null);

  const fetchChats = async () => {
    const chatResponse = await chatService.getMyChats(connectedUser.authToken);
    if (!chatResponse.success) {
      toast.error(
        "Unable to load conversations. Please check your connection and try again."
      );
      return;
    }
    setChats(
      chatResponse.response
        .filter((m) => m.lastMessageTime != null)
        .sort((a, b) => {
          return new Date(b.lastMessageTime) - new Date(a.lastMessageTime);
        })
    );
<<<<<<< HEAD
=======
    console.log("chat response: ", chatResponse);
>>>>>>> 6bb01d1 (feat: User can signup with google)
    setLoading(false);
  };

  const fetchChatById = async (chatId) => {
    const chatResponse = await chatService.findChatById(
      chatId,
      connectedUser.authToken
    );
    if (!chatResponse.success) {
      toast.error("Failed to load the chat by Id: ", chatId);
      // load the page
      window.location.reload();
      return;
    }
    const updatedChat = chatResponse.response;
    setChats((prev) =>
      prev
        .map((c) => (c.id === updatedChat.id ? updatedChat : c))
        .filter((m) => m.lastMessageTime != null)
        .sort((a, b) => {
          return new Date(b.lastMessageTime) - new Date(a.lastMessageTime);
        })
    );
  };

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws");
    stompClient.current = Stomp.over(socket);

    stompClient.current.connect(
      {},
      () => {
        stompClient.current.subscribe(
          `/users/${connectedUser.id}/chat`,
          (messages) => {
            const notification = JSON.parse(messages.body);
            if (notification.type === "MESSAGE" || notification.type === "SEEN") {
              fetchChatById(notification.chatId);
            }
          }
        );
      },
      (error) => {
        toast.error("Failed to connect to the server!");
        console.log("Websocker error:", error);
      }
    );
    return () => {
      if (stompClient.current?.connected) {
        stompClient.current.disconnect();
      }
    };
  }, [openCreateChatPage, setCurrentChat]);

  return (
    <div className="chat-previews">
      <div className="heading">
        <h1>Chats</h1>
        <div className="options">
          <div className="create-chat" onClick={() => openCreateChatPage()}>
            <svg
              viewBox="0 0 24 24"
              height="24"
              width="24"
              preserveAspectRatio="xMidYMid meet"
              fill="none"
            >
              <path
                d="M9.53277 12.9911H11.5086V14.9671C11.5086 15.3999 11.7634 15.8175 12.1762 15.9488C12.8608 16.1661 13.4909 15.6613 13.4909 15.009V12.9911H15.4672C15.9005 12.9911 16.3181 12.7358 16.449 12.3226C16.6659 11.6381 16.1606 11.0089 15.5086 11.0089H13.4909V9.03332C13.4909 8.60007 13.2361 8.18252 12.8233 8.05119C12.1391 7.83391 11.5086 8.33872 11.5086 8.991V11.0089H9.49088C8.83941 11.0089 8.33411 11.6381 8.55097 12.3226C8.68144 12.7358 9.09947 12.9911 9.53277 12.9911Z"
                fill="currentColor"
              ></path>
              <title>New chat</title>
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0.944298 5.52617L2.99998 8.84848V17.3333C2.99998 18.8061 4.19389 20 5.66665 20H19.3333C20.8061 20 22 18.8061 22 17.3333V6.66667C22 5.19391 20.8061 4 19.3333 4H1.79468C1.01126 4 0.532088 4.85997 0.944298 5.52617ZM4.99998 8.27977V17.3333C4.99998 17.7015 5.29845 18 5.66665 18H19.3333C19.7015 18 20 17.7015 20 17.3333V6.66667C20 6.29848 19.7015 6 19.3333 6H3.58937L4.99998 8.27977Z"
                fill="currentColor"
              ></path>
            </svg>
          </div>
          <div className="more">
            <FontAwesomeIcon icon={faEllipsisVertical} title="Menu" />
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
      {loading ? (
        <div className="chats">
          {["", "", "", "", ""].map((__, idx) => (
            <ChatLoading key={idx} />
          ))}
        </div>
      ) : (
        <>
          {chats.length === 0 ? (
            <div className="chats empty-chats">
              <div className="empty-state-container">
                <div className="empty-chat-image">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/4208/4208361.png"
                    alt="No chats"
                  />
                </div>

                <h1 className="empty-heading">No Conversations Found</h1>
                <p className="empty-subtext">
                  Start messaging by selecting a contact or searching for
                  someone new.
                </p>
                <button className="create-chat-btn">
                  <svg
                    viewBox="0 0 24 24"
                    height="24"
                    width="24"
                    preserveAspectRatio="xMidYMid meet"
                    fill="none"
                  >
                    <path
                      d="M9.53277 12.9911H11.5086V14.9671C11.5086 15.3999 11.7634 15.8175 12.1762 15.9488C12.8608 16.1661 13.4909 15.6613 13.4909 15.009V12.9911H15.4672C15.9005 12.9911 16.3181 12.7358 16.449 12.3226C16.6659 11.6381 16.1606 11.0089 15.5086 11.0089H13.4909V9.03332C13.4909 8.60007 13.2361 8.18252 12.8233 8.05119C12.1391 7.83391 11.5086 8.33872 11.5086 8.991V11.0089H9.49088C8.83941 11.0089 8.33411 11.6381 8.55097 12.3226C8.68144 12.7358 9.09947 12.9911 9.53277 12.9911Z"
                      fill="currentColor"
                    ></path>
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M0.944298 5.52617L2.99998 8.84848V17.3333C2.99998 18.8061 4.19389 20 5.66665 20H19.3333C20.8061 20 22 18.8061 22 17.3333V6.66667C22 5.19391 20.8061 4 19.3333 4H1.79468C1.01126 4 0.532088 4.85997 0.944298 5.52617ZM4.99998 8.27977V17.3333C4.99998 17.7015 5.29845 18 5.66665 18H19.3333C19.7015 18 20 17.7015 20 17.3333V6.66667C20 6.29848 19.7015 6 19.3333 6H3.58937L4.99998 8.27977Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                  Create New Chat
                </button>

                <div className="additional-info">
                  <p>Your conversations will appear here</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="chats">
              {chats.map((chat) => (
                <Chat
                  chat={chat}
                  key={chat.id}
                  setCurrentChat={setCurrentChat}
                />
              ))}
            </div>
          )}
        </>
      )}
      {/* </div> */}
      <div className="bottom-info">
        <span className="secure-info">
          <FontAwesomeIcon icon={faLock} /> Your personal messages are{" "}
          <span style={{ fontWeight: "bold", color: "#21c063" }}>
            end-to-end encrypted
          </span>
        </span>
      </div>
    </div>
  );
}

export default ChatPreviews;
