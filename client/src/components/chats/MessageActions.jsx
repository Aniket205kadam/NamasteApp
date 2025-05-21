import React from "react";
import "../../styles/MessageActions.css";

function MessageActions({
  position,
  ref,
  isText,
  isOwnMessage,
  handleDownload,
  closeAction,
  message,
  setReply,
  setShowDelete,
}) {
  const copyText = () => {
    navigator.clipboard
      .writeText(message.content)
      .then(() => {
        console.log("Message copied");
      })
      .catch((error) => {
        console.log("Failed to copy message", error);
      });
  };

  return (
    <div
      className="message-action-container"
      ref={ref}
      style={{ top: position.y, left: position.x }}
    >
      <div className="_options">
        {isOwnMessage && <div className="_option">Message info</div>}
        <div
          className="_option"
          onClick={() => {
            setReply(message);
            closeAction();
          }}
        >
          Reply
        </div>
        {isText && (
          <div
            className="_option"
            onClick={() => {
              copyText();
              closeAction();
            }}
          >
            Copy
          </div>
        )}
        {!isText && (
          <div
            className="_option"
            onClick={() => {
              handleDownload();
              closeAction();
            }}
          >
            Download
          </div>
        )}
        <div className="_option">Forward</div>
        {!isOwnMessage && <div className="_option">Report</div>}
        <div
          className="_option"
          onClick={() => {
            setShowDelete({ status: true, message: message });
            closeAction();
          }}
        >
          Delete
        </div>
      </div>
    </div>
  );
}

export default MessageActions;
