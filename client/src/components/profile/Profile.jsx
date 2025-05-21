import {
  faCamera,
  faCheck,
  faFaceSmile,
  faPen,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import "../../styles/Profile.css";
import Emojis from "../chats/Emojis";
import useClickOutside from "../../hooks/useClickOutside";
import { useDispatch, useSelector } from "react-redux";
import UserService from "../../service/UserService";
import { toast } from "react-toastify";
import AvtarOptions from "./AvtarOptions";
import { login } from "../../store/authSlice";
import RemoveProfilePopup from "./RemoveProfilePopup";

function Profile() {
  const connectedUser = useSelector((state) => state.authentication);
  const [name, setName] = useState({
    value: "",
    isEditable: false,
  });
  const [about, setAbout] = useState({
    value: "",
    isEditable: false,
  });
  const [isDisplayEmojis, setIsDisplayEmojis] = useState(false);
  const [isDisplayAvtarOptions, setIsDisplayAvtarOptions] = useState(false);
  const [actionPosition, setActionPosition] = useState();
  const [isShowRemoveProfile, setIsShowRemoveProfile] = useState(false);
  const nameRef = useRef(null);
  const aboutRef = useRef(null);
  const emojiRef = useRef(null);
  const avtarOptionRef = useRef(null);
  const removeProfileRef = useRef(null);
  const dispatch = useDispatch();

  useClickOutside(emojiRef, () => setIsDisplayEmojis(false));
  useClickOutside(avtarOptionRef, () => setIsDisplayAvtarOptions(false));
  useClickOutside(removeProfileRef, () => setIsShowRemoveProfile(false));

  const updateUserData = async () => {
    const updateResponse = await UserService.updateUser(
      {
        name: name.value,
        about: about.value,
      },
      connectedUser.authToken
    );
    if (!updateResponse.success) {
      toast.error("Failed to update");
      return;
    }
    setName({ value: name.value, isEditable: false });
    setAbout({ value: about.value, isEditable: false });
    dispatch(
      login({
        id: connectedUser.id,
        fullName: updateResponse.firstname + " " + updateResponse.lastname,
        email: connectedUser.email,
        isAuthenticated: connectedUser.isAuthenticated,
        authToken: connectedUser.authToken,
        avtar: connectedUser.avtar,
      })
    );
  };

  const fetchUserById = async () => {
    const userResponse = await UserService.findUserById(
      connectedUser.id,
      connectedUser.authToken
    );
    if (!userResponse.success) {
      toast.error("Failed to load the user");
      return;
    }
    setName({
      value:
        userResponse.response.firstname + " " + userResponse.response.lastname,
      isEditable: name.isEditable,
    });
    setAbout({
      value: userResponse.response.about,
      isEditable: about.isEditable,
    });
  };

  const handleContextMenu = (event) => {
    event.preventDefault();
    const { clientX, clientY } = event;
    const { innerWidth, innerHeight } = window;

    const x = clientX + 200 > innerWidth ? clientX - 200 : clientX;
    const y = clientY + 250 > innerHeight ? clientY - 250 : clientY;

    setActionPosition({ x, y });
    setIsDisplayAvtarOptions(true);
  };

  useEffect(() => {
    fetchUserById();
  }, [connectedUser.id]);

  useEffect(() => {
    if (name.isEditable && nameRef.current) {
      nameRef.current.focus();
    }

    if (about.isEditable && aboutRef.current) {
      aboutRef.current.focus();
    }
  }, [name.isEditable, about.isEditable]);

  return (
    <div className="profile-section">
      <header className="profile__header">
        <h1 className="profile__title">Profile</h1>
      </header>

      {isShowRemoveProfile && <RemoveProfilePopup close={() => setIsShowRemoveProfile(false)} removeProfileRef={removeProfileRef} />}

      {isDisplayEmojis && (
        <>
          {name.isEditable ? (
            <Emojis inProfile={true} setMsg={setName} ref={emojiRef} />
          ) : (
            <Emojis inProfile={true} setMsg={setAbout} ref={emojiRef} />
          )}
        </>
      )}

      {isDisplayAvtarOptions && (
        <AvtarOptions
          position={actionPosition}
          ref={avtarOptionRef}
          close={() => setIsDisplayAvtarOptions(false)}
          setIsShowRemoveProfile={setIsShowRemoveProfile}
        />
      )}

      <div className="profile__avatar-section">
        <img
          src={connectedUser.avtar}
          alt={`${connectedUser.fullName} profile`}
          className="profile__avatar"
        />
        <div
          className="profile__avatar-overlay"
          onClick={handleContextMenu}
          title="Change profile photo"
        >
          <FontAwesomeIcon icon={faCamera} className="profile__camera-icon" />
          <span className="profile__avatar-text">ADD PROFILE PHOTO</span>
        </div>
      </div>

      <div className="profile__info-item">
        <div className="profile__info-content">
          <span className="profile__info-label">Your name</span>
          <input
            type="text"
            className={`${
              name.isEditable ? "profile__info-edit" : "profile__info-value"
            }`}
            value={name.value}
            disabled={!name.isEditable}
            ref={nameRef}
            onChange={(event) =>
              setName({
                value: event.target.value,
                isEditable: name.isEditable,
              })
            }
          />
        </div>
        {name.isEditable && (
          <div className="edits-options">
            <span className="value-count">{name.value?.length}</span>
            <div
              className="emoji-symbol"
              onClick={() => setIsDisplayEmojis(true)}
            >
              <FontAwesomeIcon icon={faFaceSmile} />
            </div>
            <button className="update-btn" onClick={updateUserData}>
              <FontAwesomeIcon icon={faCheck} />
            </button>
          </div>
        )}
        {!name.isEditable && (
          <button
            className="profile__edit-btn"
            onClick={() => {
              setName({ value: name.value, isEditable: true });
            }}
          >
            <FontAwesomeIcon icon={faPen} />
          </button>
        )}
      </div>

      <p className="profile__security-note">
        This is not your username or PIN. This name will be visible to your
        NamasteApp contacts.
      </p>

      <div className="profile__info-item">
        <div className="profile__info-content">
          <span className="profile__info-label">About</span>
          <input
            type="text"
            className={`${
              about.isEditable ? "profile__info-edit" : "profile__info-value"
            }`}
            value={about.value}
            disabled={!about.isEditable}
            ref={aboutRef}
            onChange={(event) =>
              setAbout({
                value: event.target.value,
                isEditable: about.isEditable,
              })
            }
          />
        </div>
        {about.isEditable && (
          <div className="edits-options">
            <span className="value-count">{about.value?.length}</span>
            <div
              className="emoji-symbol"
              onClick={() => setIsDisplayEmojis(true)}
            >
              <FontAwesomeIcon icon={faFaceSmile} />
            </div>
            <button className="update-btn" onClick={updateUserData}>
              <FontAwesomeIcon icon={faCheck} />
            </button>
          </div>
        )}
        {!about.isEditable && (
          <button
            className="profile__edit-btn"
            onClick={() => {
              setAbout({ value: about.value, isEditable: true });
            }}
          >
            <FontAwesomeIcon icon={faPen} />
          </button>
        )}
      </div>
    </div>
  );
}

export default Profile;
