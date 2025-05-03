import {
    faCheck,
    faCheckDouble,
    faChevronDown,
    faSmile,
  } from "@fortawesome/free-solid-svg-icons";
  import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
  import React from "react";
  
  function Message({ message }) {
    return (
      <div className={`message ${message.isOwn ? "message--own" : ""}`}>
        {message.type === "TEXT" && <TextMessage message={message} />}
        {message.type === "IMAGE" && <ImageMessage message={message} />}
      </div>
    );
  }
  
  const ImageMessage = ({ message }) => {
    return (
      <div className="message__container">
        <div className="message__content message__content--image">
          <img src={message.content} alt="content" className="message__image" />
          <div className="message__meta">
            <span className="message__time">{message.time}</span>
            {message.isOwn && (
              <span className="message__status">
                {message.status === "sent" && <FontAwesomeIcon icon={faCheck} />}
                {message.status === "delivered" && <FontAwesomeIcon icon={faCheckDouble} />}
                {message.status === "read" && (
                  <FontAwesomeIcon icon={faCheckDouble} style={{ color: "#53bdeb" }} />
                )}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  const TextMessage = ({ message }) => {
    return (
      <div className="message__container">
        <div className="message__content">
          <p className="message__text">{message.content}</p>
          <div className="message__meta">
            <span className="message__time">{message.time}</span>
            {message.isOwn && (
              <span className="message__status">
                {message.status === "sent" && <FontAwesomeIcon icon={faCheck} />}
                {message.status === "delivered" && <FontAwesomeIcon icon={faCheckDouble} />}
                {message.status === "read" && (
                  <FontAwesomeIcon icon={faCheckDouble} style={{ color: "#53bdeb" }} />
                )}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  export default Message;