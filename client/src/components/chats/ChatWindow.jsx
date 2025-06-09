import {
  faArrowRight,
  faArrowRightArrowLeft,
  faBolt,
  faCamera,
  faEllipsisVertical,
  faFile,
  faMagnifyingGlass,
  faMicrophone,
  faPlus,
  faSmile,
  faVideo,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { use, useEffect, useRef, useState } from "react";
import Message from "./Message";
import "../../styles/ChatWindow.css";
import chatService from "../../service/ChatService";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import NoProfile from "../../assets/no-profile.png";
import useNotificationTimeConvertor from "../../hooks/useNotificationTimeConvertor";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import useDateConvertor from "../../hooks/useDateConvertor";
import DocumentationOption from "../doc/DocumentationOption";
import useClickOutside from "../../hooks/useClickOutside";
import DisplayFile from "../doc/DisplayFile";
import Emojis from "./Emojis";
import UserService from "../../service/UserService";
import GIFLogo from "./GIFLogo";
import ChatActions from "./ChatActions";
import DeletePopup from "./DeletePopup";
import AIService from "../../service/AIService";
import { logout } from "../../store/authSlice";

function ChatWindow({ chatId, openSearch }) {
  const [chat, setChat] = useState({ name: "NamasteApp User" });
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState("");
  const connectedUser = useSelector((state) => state.authentication);
  const stompClient = useRef(null);
  const [file, setFile] = useState(null);
  const [isFileSelectionOptionOpen, setIsFileSelectionOptionOpen] =
    useState(false);
  const fileOptionsRef = useRef(null);
  const [caption, setCaption] = useState("");
  const [isDisplayEmojis, setIsDisplayEmojis] = useState(false);
  const emojiRef = useRef(null);
  const [reply, setReply] = useState(null);
  const [replyMsgSender, setReplyMsgSender] = useState(null);
  const [actionPosition, setActionPosition] = useState({ x: 0, y: 0 });
  const [showActions, setShowAction] = useState(false);
  const chatActionsRef = useRef(null);
  const [showDelete, setShowDelete] = useState({
    status: false,
    message: null,
  });
  const [isBotChat, setIsBotChat] = useState(false);
  const [isChatLoaded, setIsChatLoaded] = useState(false);
  const deletePopupRef = useRef(null);
  const messageRef = useRef();
  const timerRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);
  const removeTypingRef = useRef(null);
  const [enhanceLoading, setEnhanceLoading] = useState(false);
  const [highlightMsg, setHighlightMsg] = useState(false);
  const dispatch = useDispatch();

  useClickOutside(fileOptionsRef, () => setIsFileSelectionOptionOpen(false));
  useClickOutside(emojiRef, () => setIsDisplayEmojis(false));
  useClickOutside(chatActionsRef, () => setShowAction(false));
  useClickOutside(deletePopupRef, () => setShowDelete(false));

  const fetchChat = async () => {
    const chatResponse = await chatService.findChatById(
      chatId,
      connectedUser.authToken
    );
    if (!chatResponse.success) {
      toast.error("Failed to fetch the chat!");
      if (chatResponse.status === 403 || chatResponse.status === 401) {
        dispatch(logout());
      }
      return;
    }
    setChat(chatResponse.response);
    setIsChatLoaded(true);
  };

  const fetchMessages = async () => {
    const messageResponse = await chatService.findMessages(
      chatId,
      connectedUser.authToken
    );
    if (!messageResponse.success) {
      toast.error("Failed to fetch chat messages");
      if (messageResponse.status === 403 || messageResponse.status === 401) {
        dispatch(logout());
      }
      return;
    }
    setMessages(messageResponse.response);
  };

  const sendMessageHandler = async () => {
    if (!chat.id) {
      toast.error("Chat data not loaded yet!");
      return;
    }
    let chatResponse = "";
    if (reply) {
      chatResponse = await chatService.sendMessage(
        {
          content: msg,
          senderId: connectedUser.id,
          receiverId:
            connectedUser.id === chat.senderId
              ? chat.receiverId
              : chat.senderId,
          type: "TEXT",
          chatId: chat.id,
          replyId: reply.id,
        },
        connectedUser.authToken
      );
    } else {
      chatResponse = await chatService.sendMessage(
        {
          content: msg,
          senderId: connectedUser.id,
          receiverId:
            connectedUser.id === chat.senderId
              ? chat.receiverId
              : chat.senderId,
          type: "TEXT",
          chatId: chat.id,
        },
        connectedUser.authToken
      );
    }
    if (!chatResponse.success) {
      toast.error("Failed to send the message!");
      if (chatResponse.status === 403 || chatResponse.status === 401) {
        dispatch(logout());
      }
      return;
    }
    setMessages((prev) => [...prev, chatResponse.response]);
    setMsg("");
    setReply(null);
    setReplyMsgSender(null);
  };

  const seenMessages = async () => {
    const chatResponse = await chatService.seenMessages(
      chatId,
      connectedUser.authToken
    );
    if (!chatResponse.success) {
      toast.error("Failed to seen the messages");
      // reload the page
      window.location.reload();
      if (chatResponse.status === 403 || chatResponse.status === 401) {
        dispatch(logout());
      }
      return;
    }
  };

  const sendFileHandler = async () => {
    const fileResponse = await chatService.uploadFile(
      file,
      caption,
      chatId,
      connectedUser.authToken
    );
    if (!fileResponse.success) {
      toast.error("Failed to upload the file");
      if (fileResponse.status === 403 || fileResponse.status === 401) {
        dispatch(logout());
      }
      return;
    }
    setMessages((prev) => [...prev, fileResponse.response]);
    setFile(null);
  };

  const sendGif = async (url) => {
    if (!chat.id) {
      toast.error("Chat data not loaded yet!");
      return;
    }
    const chatResponse = await chatService.sendMessage(
      {
        senderId: connectedUser.id,
        receiverId:
          connectedUser.id === chat.senderId ? chat.receiverId : chat.senderId,
        type: "GIF",
        chatId: chat.id,
        gifUrl: url,
      },
      connectedUser.authToken
    );
    if (!chatResponse.success) {
      toast.error("Failed to send the message!");
      if (chatResponse.status === 403 || chatResponse.status === 401) {
        dispatch(logout());
      }
      return;
    }
    setMessages((prev) => [...prev, chatResponse.response]);
    setMsg("");
  };

  const fetchUserById = async () => {
    const userResponse = await UserService.findUserById(
      reply.senderId,
      connectedUser.authToken
    );
    if (!userResponse.success) {
      toast.error("Failed to fetch the user");
      if (userResponse.status === 403 || userResponse.status === 401) {
        dispatch(logout());
      }
      return;
    }
    setReplyMsgSender(userResponse.response);
  };

  const handleContextMenu = (event) => {
    event.preventDefault();
    const { clientX, clientY } = event;
    const { innerWidth, innerHeight } = window;

    const x = clientX + 200 > innerWidth ? clientX - 200 : clientX;
    const y = clientY + 250 > innerHeight ? clientY - 250 : clientY;

    setActionPosition({ x, y });
    setShowAction(true);
  };

  const deleteMessage = async (messageId) => {
    const messageResponse = await chatService.deleteMessage(
      chat.id,
      messageId,
      connectedUser.authToken
    );
    if (!messageResponse.success) {
      toast.error("Failed to delete the message");
      if (messageResponse.status === 403 || messageResponse.status === 401) {
        dispatch(logout());
      }
      return;
    }
    setShowDelete(false);
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageResponse.response.id
          ? { ...msg, ...messageResponse.response }
          : msg
      )
    );
  };

  const fetchAIBot = async () => {
    const botResponse = await AIService.getAIBot(connectedUser.authToken);
    if (!botResponse.success) {
      console.error("Failed to load the AI Bot");
      if (botResponse.status === 403 || botResponse.status === 401) {
        dispatch(logout());
      }
      return;
    }
    const bot = botResponse.response;
    setIsBotChat(bot.id === chat.receiverId || bot.id === chat.senderId);
  };

  const sendTypingNotification = async () => {
    const typingResponse = await chatService.sendMessageTypingNotification(
      {
        senderId: connectedUser.id,
        receiverId:
          connectedUser.id === chat.senderId ? chat.receiverId : chat.senderId,
        chatId: chat.id,
        typing: true,
      },
      connectedUser.authToken
    );
    if (!typingResponse.success) {
      console.error("Failed to send the typing notification");
      if (typingResponse.status === 403 || typingResponse.status === 401) {
        dispatch(logout());
      }
      return;
    }
  };

  const sendMessageTypingNotification = async () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      sendTypingNotification();
    }, 300);
  };

  const handleEnhanceMessage = async () => {
    setEnhanceLoading(true);
    const messageResponse = await chatService.enhanceMessage(
      msg,
      connectedUser.authToken
    );
    if (!messageResponse.success) {
      console.error("Failed to enhance the message!");
      if (messageResponse.status === 403 || messageResponse.status === 401) {
        dispatch(logout());
      }
      return;
    }
    setMsg(messageResponse.response);
    setEnhanceLoading(false);
    setHighlightMsg(true);
  };

  useEffect(() => {
    if (!highlightMsg) return;

    const highlightTimer = setTimeout(() => {
      setHighlightMsg(false);
    }, 3000);

    return () => {
      clearTimeout(highlightTimer);
    };
  }, [highlightMsg]);

  useEffect(() => {
    setReply(null);
    fetchChat();
    fetchMessages();
  }, [chatId]);

  useEffect(() => {
    if (chat && messages.length > 0) {
      seenMessages();
    }
  }, [messages.length]);

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
            console.log("Notification: ", notification);
            if (notification.type === "MESSAGE") {
              const newMsg = notification.message;
              setMessages((prev) => [
                ...new Set([
                  ...prev,
                  {
                    ...newMsg,
                    createdAt: useDateConvertor(newMsg.createdAt),
                  },
                ]),
              ]);
              // }
            } else if (
              notification.type === "SEEN" &&
              notification.receiverId === connectedUser.id
            ) {
              setMessages((prev) =>
                prev.map((m) =>
                  m.state === "SEEN" ? m : { ...m, state: notification.type }
                )
              );
            }
          }
        );

        stompClient.current.connect(
          {},
          () => {
            stompClient.current.subscribe(
              `/users/${connectedUser.id}/message/typing`,
              (messages) => {
                const typingNotification = JSON.parse(messages.body);
                if (
                  typingNotification.chatId === chatId &&
                  typingNotification.receiverId === connectedUser.id
                ) {
                  if (!isTyping) {
                    setIsTyping(typingNotification.typing);
                    clearIsTyping();
                  }
                }
              }
            );
          },
          (error) => {
            console.error("Failed to connect to the server!");
            console.error(error);
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
  }, [chatId]);

  const clearIsTyping = () => {
    if (removeTypingRef.current) {
      clearTimeout(removeTypingRef.current);
    }
    removeTypingRef.current = setTimeout(() => setIsTyping(false), 3000);
  };

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    if (isChatLoaded) {
      fetchAIBot();
    }
  }, [chat]);

  useEffect(() => {
    if (file) {
      // first close the file options
      setIsFileSelectionOptionOpen(false);
    }
  }, [file]);

  useEffect(() => {
    if (reply) {
      fetchUserById();
    }
  }, [reply]);

  return (
    <div className="chat-window">
      {/* Select file */}
      {isFileSelectionOptionOpen && (
        <DocumentationOption setFile={setFile} ref={fileOptionsRef} />
      )}

      <div className="chat-window__header">
        <div className="chat-window__profile">
          <img
            src={chat.avtar || NoProfile}
            alt={chat.name}
            className="chat-window__avatar"
          />
          <div className="chat-window__info">
            <span className="chat-window__name">{chat.name}</span>
            <span className="chat-window__status">
              {isTyping ? (
                <span style={{ color: "#04b00f" }}>Typing...</span>
              ) : chat.recipientOnline ? (
                <span>online</span>
              ) : (
                <span>offline</span>
              )}
            </span>
          </div>
        </div>
        <div className="chat-window__actions">
          <div className="search-btn" onClick={() => openSearch()}>
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="chat-window__icon"
            />
          </div>
          <div className="more-btn">
            <FontAwesomeIcon
              icon={faEllipsisVertical}
              className="chat-window__icon"
            />
          </div>
        </div>
      </div>

      <div className="chat-window__messages" onContextMenu={handleContextMenu}>
        {showDelete.status && (
          <DeletePopup
            deleteMessage={deleteMessage}
            message={showDelete.message}
            ref={deletePopupRef}
            setShowDelete={setShowDelete}
          />
        )}
        {showActions && (
          <ChatActions position={actionPosition} ref={chatActionsRef} />
        )}
        {msg.length > 0 && (
          <div
            className={`enhance-btn ${
              enhanceLoading ? "enhance-loading" : ""
            } ${highlightMsg ? "enhanced-highlight" : ""}`}
            onClick={handleEnhanceMessage}
          >
            <FontAwesomeIcon icon={faBolt} />
          </div>
        )}
        {messages.map((message, idx) => (
          <div className="_messages" key={message.id}>
            <div>
              {/* TODO improve later */}
              {/* <PrintTime
                createdAt={message.createdAt}
                time={time}
                setTime={setTime}
                idx={idx}
              /> */}
            </div>
            <Message
              message={message}
              setReply={setReply}
              chatId={chatId}
              setShowDelete={setShowDelete}
            />
          </div>
        ))}

        {/* Display selected file */}
        {file && (
          <DisplayFile
            file={file}
            setFile={setFile}
            sendFileHandler={sendFileHandler}
            caption={caption}
            setCaption={setCaption}
          />
        )}
      </div>

      {reply && replyMsgSender && (
        <div
          className="reply-section"
          style={
            replyMsgSender.id === connectedUser.id
              ? reply.type != "TEXT" && reply.type != "UNKNOWN"
                ? { borderLeft: "4px solid #3d72e3", height: "100px" }
                : { borderLeft: "4px solid #3d72e3" }
              : reply.type != "TEXT" && reply.type != "UNKNOWN"
              ? { borderLeft: "4px solid #00a884", height: "100px" }
              : { borderLeft: "4px solid #00a884" }
          }
        >
          <div className="info-section">
            <span
              className="msg-sender"
              style={
                replyMsgSender.id === connectedUser.id
                  ? { color: "#3d72e3" }
                  : { color: "#00a884" }
              }
            >
              {replyMsgSender.id === connectedUser.id
                ? "You"
                : `${replyMsgSender.firstname} ${replyMsgSender.lastname}`}
            </span>
            <div className="msg">
              {reply.type === "TEXT" ? (
                <span>{reply.content}</span>
              ) : reply.type === "IMAGE" || reply.type === "GIF" ? (
                <div className="content-type">
                  {reply.type === "GIF" ? (
                    <>
                      <GIFLogo />
                      GIF
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faCamera} />
                      Photo
                    </>
                  )}
                </div>
              ) : reply.type === "VIDEO" ? (
                <div className="content-type">
                  <FontAwesomeIcon icon={faVideo} />
                  Video
                </div>
              ) : (
                <div className="content-type">
                  <FontAwesomeIcon icon={faFile} />
                  {reply.fileOriginalName}
                </div>
              )}
            </div>
          </div>
          {!(reply.type === "TEXT" || reply.type === "UNKNOWN") && (
            <div className="media-preview">
              {reply.type === "IMAGE" || reply.type === "GIF" ? (
                <img
                  src={reply.type === "IMAGE" ? reply.media : reply.gifUrl}
                />
              ) : (
                <video src={reply.media} />
              )}
            </div>
          )}
          <div
            className="close-btn"
            onClick={() => {
              setReply(null);
              setReplyMsgSender(null);
            }}
          >
            <FontAwesomeIcon icon={faXmark} />
          </div>
        </div>
      )}
      <div className="chat-window__input">
        {!isBotChat && (
          <FontAwesomeIcon
            icon={faPlus}
            className="chat-window__input-icon"
            onClick={() => setIsFileSelectionOptionOpen(true)}
          />
        )}
        {isDisplayEmojis && (
          <Emojis ref={emojiRef} setMsg={setMsg} sendGif={sendGif} />
        )}
        <div className="chat-window__input-container">
          <div
            className="emoji"
            style={{ cursor: "pointer" }}
            onClick={() => setIsDisplayEmojis(true)}
          >
            <FontAwesomeIcon icon={faSmile} color="#a8afb9" />
          </div>
          <input
            type="text"
            placeholder="Type a message"
            className={`chat-window__input-field ${
              highlightMsg ? "highlight" : ""
            }`}
            value={msg}
            style={highlightMsg ? { backgroundColor: "#00a884" } : {}}
            onChange={(event) => {
              setMsg(event.target.value);
              if (msg.length > 0) {
                sendMessageTypingNotification();
              }
            }}
          />
          {msg.length === 0 ? (
            <button className="send-btn">
              {!isBotChat && (
                <FontAwesomeIcon
                  icon={faMicrophone}
                  className="chat-window__input-icon"
                />
              )}
            </button>
          ) : (
            <button
              className="send-btn"
              title="Send message"
              onClick={sendMessageHandler}
            >
              <svg
                viewBox="0 0 24 24"
                height="24"
                width="24"
                preserveAspectRatio="xMidYMid meet"
                version="1.1"
                x="0px"
                y="0px"
                enableBackground="new 0 0 24 24"
              >
                <title>Send</title>
                <path
                  fill="currentColor"
                  d="M1.101,21.757L23.8,12.028L1.101,2.3l0.011,7.912l13.623,1.816L1.112,13.845 L1.101,21.757z"
                ></path>
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

//TODO: it's not as desided
const PrintTime = ({ createdAt, time, setTime, idx }) => {
  const convertedTime = useNotificationTimeConvertor(createdAt, true);

  useEffect(() => {
    if (convertedTime !== time) {
      setTime(convertedTime);
    }
  }, []);

  if (convertedTime === time && idx !== 0) {
    return null;
  }

  return <span className="timestamp">{convertedTime}</span>;
};

export default ChatWindow;
