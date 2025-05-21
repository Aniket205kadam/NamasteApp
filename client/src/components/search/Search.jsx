import {
  faCalendar,
  faCheck,
  faCheckDouble,
  faMagnifyingGlass,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import chatService from "../../service/ChatService";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import "../../styles/Search.css";
import useChatTimeConvertor from "../../hooks/useChatTimeConvertor";

function Search({ chatId, onClose }) {
  const [originalMessages, setOriginalMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const connectedUser = useSelector((state) => state.authentication);
  const [query, setQuery] = useState("");
  const [name, setName] = useState("");

  const fetchMessages = async () => {
    const messageResponse = await chatService.findMessages(
      chatId,
      connectedUser.authToken
    );
    if (!messageResponse.success) {
      toast.error("Failed to fetch the messages");
      return;
    }
    setOriginalMessages(messageResponse.response);
    setFilteredMessages(messageResponse.response);
  };

  const fetchChatName = async () => {
    const chatResponse = await chatService.findChatById(
      chatId,
      connectedUser.authToken
    );
    if (!chatResponse.success) {
      toast.error("Failed to fetch the chat with Id: " + chatId);
      return;
    }
    setName(chatResponse.response.name);
  };

  useEffect(() => {
    fetchMessages();
    fetchChatName();
  }, [chatId]);

  useEffect(() => {
    if (query) {
      const filtered = originalMessages.filter((msg) =>
        msg.content.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredMessages(filtered);
    } else {
      setFilteredMessages(originalMessages);
    }
  }, [query, originalMessages]);

  const clearSearch = () => {
    setQuery("");
  };

  return (
    <div className="search-container">
      <div className="search-header">
        <div className="search-header-content">
          <button className="close-btn" onClick={onClose}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
          <span className="search-title">Search messages</span>
        </div>
      </div>

      <div className="search-input-container">
        <div className="search-input-wrapper">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="search-icon" />
          <input
            type="text"
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-input"
          />
          {query && (
            <button className="clear-search-btn" onClick={clearSearch}>
              <FontAwesomeIcon icon={faXmark} />
            </button>
          )}
        </div>
        <button className="date-filter-btn">
          <FontAwesomeIcon icon={faCalendar} />
        </button>
      </div>

      <div className="search-results-container">
        {query.length === 0 ? (
          <div className="search-placeholder">
            Search for messages with {name}
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="no-results">No messages found for "{query}"</div>
        ) : (
          filteredMessages.map((message) => (
            <Message key={message.id} message={message} />
          ))
        )}
      </div>
    </div>
  );
}

const Message = ({ message }) => {
  return (
    <div className="_msg">
      <span className="createdAt">
        {useChatTimeConvertor(message.createdAt)}
      </span>
      <div className="info">
        <div className="state">
        {message.state === "SENT" && <FontAwesomeIcon icon={faCheck} />}
        {message.state === "RECEIVED" && (
          <FontAwesomeIcon icon={faCheckDouble} />
        )}
        {message.state === "SEEN" && (
          <FontAwesomeIcon icon={faCheckDouble} style={{ color: "#53bdeb" }} />
        )}
        </div>
        <div className="content">{message.content}</div>
      </div>
    </div>
  );
};

export default Search;
