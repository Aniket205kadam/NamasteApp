import React from "react";
import "../../styles/DeletePopup.css";
import { useSelector } from "react-redux";

function DeletePopup({ message, deleteMessage, ref, setShowDelete }) {
  const connectedUser = useSelector((state) => state.authentication);

  return (
    <div className="delete-popup-overlay">
      <div className="delete-popup" ref={ref}>
        <span className="msg">Delete message?</span>
        <div className="delete-actions">
          {connectedUser.id === message.senderId ? (
            <button
              className="btn delete"
              onClick={() => deleteMessage(message.id)}
            >
              Delete for everyone
            </button>
          ) : (
            <button
              className="btn delete"
              onClick={() => deleteMessage(message.id)}
            >
              Delete for me
            </button>
          )}
          <button className="btn cancel" onClick={() => setShowDelete(false)}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeletePopup;
