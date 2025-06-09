import {
  faEllipsisVertical,
  faLock,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import "../../styles/StatusPreviews.css";
import { useDispatch, useSelector } from "react-redux";
import StatusOptions from "./StatusOptions";
import useClickOutside from "../../hooks/useClickOutside";
import DisplayFile from "../doc/DisplayFile";
import statusService from "../../service/StatusService";
import { toast } from "react-toastify";
import useNotificationTimeConvertor from "../../hooks/useNotificationTimeConvertor";
import { useNavigate } from "react-router-dom";
import { logout } from "../../store/authSlice";

function StatusPreviews() {
  const connectedUser = useSelector((state) => state.authentication);
  const statusOptionRef = useRef(null);
  const [showStatusOptions, setShowStatusOptions] = useState(false);
  const [statusFile, setStatusFile] = useState(null);
  const [isShowStateFile, setIsShowStateFile] = useState(false);
  const [caption, setCaption] = useState(null);
  const [connectedUserHasStatus, setConnectedUserHasStatus] = useState(false);
  const [friendsStatus, setFriendsStatus] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useClickOutside(statusOptionRef, () => setShowStatusOptions(false));

  const sendStatusWithImageOrVide = async () => {
    const statusResponse = await statusService.uploadImageOrVideo(
      statusFile,
      caption,
      connectedUser.authToken
    );
    if (!statusResponse.success) {
      toast.error("Failed to upload the status, try again!");
      if (statusResponse.status === 403 || statusResponse.status === 401) {
        dispatch(logout());
      }
      return;
    }
    console.log(statusResponse);
    toast.success("Status successfully uploaded!");
    setIsShowStateFile(false);
    setShowStatusOptions(false);
    setStatusFile(null);
  };

  const fileSelected = (file) => {
    setShowStatusOptions(false);
    setStatusFile(file);
    setIsShowStateFile(true);
  };

  const fetchConnectedUserHasStatus = async () => {
    const statusResponse = await statusService.connectedUserHasStatus(
      connectedUser.authToken
    );
    if (!statusResponse.success) {
      console.error("Failed to load the user details");
      if (statusResponse.status === 403 || statusResponse.status === 401) {
        dispatch(logout());
      }
      return;
    }
    setConnectedUserHasStatus(
      statusResponse.response === "true" ? true : false
    );
  };

  const fetchFriendsStatus = async () => {
    const statusResponse = await statusService.fetchFriendsStatus(
      connectedUser.authToken
    );
    if (!statusResponse.success) {
      log.error("Failed to fetch the friends status!");
      if (statusResponse.status === 403 || statusResponse.status === 401) {
        dispatch(logout());
      }
      return;
    }
    console.log("Frineds status: ", statusResponse);
    setFriendsStatus(statusResponse.response);
  };

  useEffect(() => {
    fetchConnectedUserHasStatus();
    fetchFriendsStatus();
  }, []);

  return (
    <div className="status-container">
      {/* Header */}
      <div className="status-heading">
        <h1 className="status-title">Status</h1>
        <div className="status-tools">
          <button
            className="status-action-btn"
            onClick={() => setShowStatusOptions(true)}
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>
          <button className="status-action-btn">
            <FontAwesomeIcon icon={faEllipsisVertical} />
          </button>
        </div>
      </div>
      {showStatusOptions && (
        <StatusOptions ref={statusOptionRef} fileSelected={fileSelected} />
      )}

      {isShowStateFile && (
        <DisplayFile
          file={statusFile}
          setFile={setStatusFile}
          sendFileHandler={sendStatusWithImageOrVide}
          setCaption={setCaption}
          caption={caption}
        />
      )}

      {/* My Status */}
      <div className="my-status" onClick={() => setShowStatusOptions(true)}>
        <div className="status-avatar-container">
          <img
            src={connectedUser.avtar}
            alt="My status"
            className={`status-avatar ${
              connectedUserHasStatus ? "unseen-status" : ""
            }`}
          />
          <div className="status-add-icon">
            <FontAwesomeIcon icon={faPlus} color="#ffffff" />
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
        {friendsStatus.length === 0 && (
          <span className="status-msg">
            None of your friends have shared a status yet.
          </span>
        )}
        {friendsStatus.map((status) => (
          <div
            className="status-item"
            key={status.id}
            onClick={() => navigate(`/status/${status.id}`)}
          >
            <div className="status-user-avatar">
              <div
                className={`status-indicator ${
                  status.seen ? "seen" : "unseen"
                }`}
              >
                <img
                  src={status.preview || "https://i.gifer.com/ZKZg.gif"}
                  alt={status.name}
                  className="status-user-image"
                />
              </div>
            </div>
            <div className="status-user-info">
              <span className="status-user-name">{status.name}</span>
              <span className="status-time">
                {useNotificationTimeConvertor(status.createdAt)}
              </span>
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
