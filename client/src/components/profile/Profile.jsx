import { faCamera, faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import "../../styles/Profile.css";

// Mock data
const connectedUser = {
  avatar:
    "https://images.pexels.com/photos/31838686/pexels-photo-31838686/free-photo-of-romantic-black-and-white-portrait-of-a-young-couple.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
  name: "John Doe",
  about: "Hey there! I am using NamasteApp",
  status: "online",
};

function Profile() {
  return (
    <div className="profile">
      {/* Profile Header */}
      <header className="profile__header">
        <h1 className="profile__title">Profile</h1>
      </header>

      {/* Avatar Section */}
      <div className="profile__avatar-section">
        <div className="profile__avatar-container">
          <img
            src={connectedUser.avatar}
            alt={connectedUser.name}
            className="profile__avatar"
          />
          <div className="profile__avatar-overlay">
            <FontAwesomeIcon icon={faCamera} className="profile__camera-icon" />
            <span className="profile__avatar-text">ADD PROFILE PHOTO</span>
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <ul className="profile__info-list">
        <li className="profile__info-item">
          <div className="profile__info-content">
            <span className="profile__info-label">Name</span>
            <span className="profile__info-value">{connectedUser.name}</span>
          </div>
          <button className="profile__edit-btn">
            <FontAwesomeIcon icon={faPen} />
          </button>
        </li>

        <li className="profile__info-item">
          <div className="profile__info-content">
            <span className="profile__info-label">About</span>
            <span className="profile__info-value">{connectedUser.about}</span>
          </div>
          <button className="profile__edit-btn">
            <FontAwesomeIcon icon={faPen} />
          </button>
        </li>
      </ul>

      {/* Security Note */}
      <p className="profile__security-note">
        This is not your username or PIN. This name will be visible to your
        NamasteApp contacts.
      </p>
    </div>
  );
}

export default Profile;
