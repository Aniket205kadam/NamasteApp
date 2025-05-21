import {
  faArrowLeft,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import "../../styles/CreateChat.css";
import ChatLoading from "../animation/ChatLoading";
import userService from "../../service/UserService";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import NoProfile from "../../assets/no-profile.png";
import chatService from "../../service/ChatService";

function CreateChat({ closeCreateChatPage, setCurrentChat }) {
  const [searchedUser, setSearchedUser] = useState([]);
  const [loading, setLoading] = useState(true);
  const connectedUser = useSelector((state) => state.authentication);
  const [query, setQuery] = useState("");

  const fetchSuggestedUser = async () => {
    setLoading(true);
    const userResponse = await userService.findUsersExceptsSelf(
      connectedUser.authToken
    );
    if (!userResponse.success) {
      toast.error("Failed to fetch the users!");
      return;
    }
    setSearchedUser(userResponse.response);
    setLoading(false);
  };

  const fetchSearchedUser = async () => {
    setLoading(true);
    const userResponse = await userService.findSearchedUsers(
      query,
      connectedUser.authToken
    );
    if (!userResponse.success) {
      toast.error("Failed to fetch the users!");
      return;
    }
    setSearchedUser(userResponse.response);
    setLoading(false);
  };

  const createChat = async (recipientId) => {
    const chatResponse = await chatService.createChats(
      connectedUser.id,
      recipientId,
      connectedUser.authToken
    );
    if (!chatResponse.success) {
        toast.error("Failed to create new chat, try again..!");
        return;
    }
    setCurrentChat(chatResponse.response.response);
    closeCreateChatPage();
  };

  useEffect(() => {
    if (query.length === 0) {
      fetchSuggestedUser();
    } else {
      fetchSearchedUser();
    }
  }, [query]);

  return (
    <div className="create-chat-container">
      <div className="chat-heading">
        <FontAwesomeIcon
          icon={faArrowLeft}
          className="back-icon"
          onClick={() => closeCreateChatPage()}
        />
        <h2>New chat</h2>
      </div>
      <div className="search-section">
        <FontAwesomeIcon icon={faMagnifyingGlass} className="search-icon" />
        <input
          type="text"
          placeholder="Search name or email"
          className="search-bar"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>
      {loading ? (
        <div className="searched-users">
          {["", "", "", "", ""].map((__, idx) => (
            <ChatLoading key={idx} />
          ))}
        </div>
      ) : (
        <div className="searched-users">
          {searchedUser.map((user) => (
            <div
              className="user"
              key={user.id}
              onClick={() => createChat(user.id)}
            >
              <div className="profile">
                <img src={user.avatar || NoProfile} alt={user.email} />
              </div>
              <div className="info">
                <span className="name">
                  {user.firstname + " " + user.lastname}
                </span>
                <span className="about">Hey there! I'm using NamasteApp.</span>{" "}
                {/* TODO: now here about static, make later dynamic */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CreateChat;
