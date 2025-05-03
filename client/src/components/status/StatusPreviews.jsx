import { faEllipsisVertical, faLock, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import "../../styles/StatusPreviews.css"

const connectedUser = { 
  avatar: "https://images.pexels.com/photos/31203739/pexels-photo-31203739/free-photo-of-black-and-white-outdoor-portrait-of-man.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"
};

const friendStatus = [
  {
    id: 1,
    user: {
      name: "John Doe",
      avatar: "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    createdAt: "10:30 AM",
    seen: false
  },
  {
    id: 2,
    user: {
      name: "Jane Smith",
      avatar: "https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    createdAt: "Yesterday",
    seen: true
  },
];

function StatusPreviews() {
  return (
    <div className="status-container">
      {/* Header */}
      <div className="status-heading">
        <h1 className="status-title">Status</h1>
        <div className="status-tools">
          <button className="status-action-btn">
            <FontAwesomeIcon icon={faPlus} />
          </button>
          <button className="status-action-btn">
            <FontAwesomeIcon icon={faEllipsisVertical} />
          </button>
        </div>
      </div>

      {/* My Status */}
      <div className="my-status">
        <div className="status-avatar-container">
          <img 
            src={connectedUser.avatar} 
            alt="My status" 
            className="status-avatar" 
          />
          <div className="status-add-icon">
            <FontAwesomeIcon icon={faPlus} />
          </div>
        </div>
        <div className="status-info">
          <span className="status-main-text">My status</span>
          <span className="status-sub-text">Tap to add status update</span>
        </div>
      </div>

      {/* Recent Updates */}
      <div className="friends-status">
        <h2 className="recent-updates-title">Recent updates</h2>
        {friendStatus.map(status => (
          <div className="status-item" key={status.id}>
            <div className="status-user-avatar">
              <div className={`status-indicator ${status.seen ? "seen" : "unseen"}`}>
                <img 
                  src={status.user.avatar || "https://via.placeholder.com/48"} 
                  alt={status.user.name} 
                  className="status-user-image" 
                />
              </div>
            </div>
            <div className="status-user-info">
              <span className="status-user-name">{status.user.name}</span>
              <span className="status-time">{status.createdAt}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="status-footer">
        <FontAwesomeIcon icon={faLock} className="lock-icon" />
        <span className="encryption-text">
          Your status updates are end-to-end encrypted
        </span>
      </div>
    </div>
  );
}

export default StatusPreviews;
