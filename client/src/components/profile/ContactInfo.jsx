import {
  faAngleRight,
  faBan,
  faHeart,
  faPen,
  faTrashCan,
  faUnlink,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import "../../styles/ContactInfo.css";
import chatService from "../../service/ChatService";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import noProfile from "../../assets/no-profile.png";
import UserService from "../../service/UserService";

// Mock data
const mockUser = {
  avatar:
    "https://images.pexels.com/photos/31203739/pexels-photo-31203739/free-photo-of-black-and-white-outdoor-portrait-of-man.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
  name: "John Doe",
  email: "john.doe@example.com",
  about: "Hey there! I am using WhatsApp.",
  status: "online",
};

const mockMedia = [
  {
    src: "https://images.pexels.com/photos/31203739/pexels-photo-31203739/free-photo-of-black-and-white-outdoor-portrait-of-man.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
    type: "image",
  },
  {
    src: "https://images.pexels.com/photos/31761351/pexels-photo-31761351/free-photo-of-abstract-perspective-of-stacked-chairs-in-argentina.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
    type: "image",
  },
  { src: "https://example.com/doc.pdf", type: "document" },
];

const mockChat = {
  isFavourite: false,
  isBlocked: false,
};

function ContactInfo({ chatId, close }) {
  const connectedUser = useSelector((state) => state.authentication);
  const [chat, setChat] = useState({});
  const [targetUser, setTargetUser] = useState({});
  const [media, setMedia] = useState([]);
  const [showMedia, setShowMedia] = useState(2);

  const fetchChatById = async () => {
    const chatResponse = await chatService.findChatById(
      chatId,
      connectedUser.authToken
    );
    if (!chatResponse.success) {
      toast.error("Failed to fetch the chat by Id");
      return;
    }
    setChat(chatResponse.response);
  };

  const fetchTargetUser = async () => {
    const targetUserId =
      chat.receiverId === connectedUser.id ? chat.senderId : chat.receiverId;
      console.log("Target User: " + targetUserId);
    const userResponse = await UserService.findUserById(
      targetUserId,
      connectedUser.authToken
    );
    if (!userResponse.success) {
      toast.error("Failed to fetch the user by Id");
      return;
    }
    setTargetUser(userResponse.response);
  };

  const fetchChatMedia = async () => {
    const chatResponse = await chatService.getChatMedia(chatId, connectedUser.authToken);
    console.log(chatResponse);
    if (!chatResponse.success) {
      toast.error("Failed to load the media!");
      return;
    }
    setMedia(chatResponse.response);
  }

  useEffect(() => {
    fetchChatById();
    fetchChatMedia();
  }, [chatId]);

  useEffect(() => {
    if (chat.name != null) {
      fetchTargetUser();
    }
  }, [chat, chatId]);

  return (
    <div className="contact-info">
      {/* Header */}
      <header className="contact-info__header">
        <button className="contact-info__close-btn" onClick={() => close()}>
          <FontAwesomeIcon icon={faXmark} size="lg" />
        </button>
        <h1 className="contact-info__title">Contact info</h1>
      </header>

      {/* Profile Section */}
      <section className="contact-info__profile">
        <div className="contact-info__avatar-wrapper">
          <img
            src={chat.avtar || noProfile}
            alt={chat.name + " profile photo"}
            className="contact-info__avatar"
          />
        </div>
        <h2 className="contact-info__name">{chat.name || "NamasteApp User"}</h2>
        <p className="contact-info__email">{targetUser.email || "NamasteAppUser@gmail.com"}</p>
      </section>

      {/* About Section */}
      <section className="contact-info__section">
        <h3 className="contact-info__section-title">About</h3>
        <p className="contact-info__about">{targetUser.about || "Hey there! I am using NamasteApp"}</p>
      </section>

      {/* Media Section */}
      <section className="contact-info__section">
        <div className="contact-info__section-header">
          <h3 className="contact-info__section-title">Media, links and docs</h3>
          <button className="contact-info__media-count" onClick={() => setShowMedia(media?.length)}>
            {media?.length || 0}
            <FontAwesomeIcon icon={faAngleRight} className="ml-2" />
          </button>
        </div>
        <div className="contact-info__media-grid">
          {media.slice(0, showMedia).map((media, index) => (
            <img
              key={index}
              src={media}
              alt={`Media ${index + 1}`}
              className="contact-info__media-thumbnail"
            />
          ))}
        </div>
      </section>

      {/* Actions Section */}
      <section className="contact-info__actions">
        <button className="contact-info__action-btn contact-info__action-btn--favourite">
          <FontAwesomeIcon icon={faHeart} />
          {mockChat.isFavourite
            ? "Remove from favourites"
            : "Add to favourites"}
        </button>
        <button className="contact-info__action-btn">
          <FontAwesomeIcon icon={faBan} />
          {mockChat.isBlocked ? "Unblock" : "Block"}
        </button>
        <button className="contact-info__action-btn">
          <FontAwesomeIcon icon={faUnlink} />
          Report
        </button>
        <button className="contact-info__action-btn contact-info__action-btn--delete">
          <FontAwesomeIcon icon={faTrashCan} />
          Delete chat
        </button>
      </section>
    </div>
  );
}

export default ContactInfo;
