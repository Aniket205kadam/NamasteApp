import StatusProgressBar from "./StatusProgressBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisVertical,
  faEye,
  faPause,
  faPlay,
  faVolumeHigh,
  faVolumeLow,
  faVolumeXmark,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import "../../styles/Status.css";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import StatusViewers from "./StatusViewers";
import useClickOutside from "../../hooks/useClickOutside";
import StatusService from "../../service/StatusService";
import { toast } from "react-toastify";

function Status({ statues, idx }) {
  const [isPlay, setIsPlay] = useState(true);
  const [isMute, setIsMute] = useState(false);
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const connectedUser = useSelector((state) => state.authentication);
  const isOwner = connectedUser.id === statues[idx].user.id;
  const [showViewers, setShowViewers] = useState(false);
  const viewerRef = useRef(null);
  const [showStatusOptions, setShowStatusOptions] = useState(false);
  const statusOptionsRef = useRef(null);
  const [showDeleteMsg, setShowDeleteMsg] = useState(false);
  const deleteMsgRef = useRef(null);

  useClickOutside(deleteMsgRef, () => setShowDeleteMsg(false));
  useClickOutside(viewerRef, () => setShowViewers(false));
  useClickOutside(statusOptionsRef, () => setShowStatusOptions(false));

  return (
    <div className="status" style={{ backgroundColor: statues[idx]?.bgColor }}>
      {showViewers && (
        <StatusViewers statusId={statues[idx].id} ref={videoRef} />
      )}
      {showStatusOptions &&
        (isOwner ? (
          <OwnStatusOptions
            ref={statusOptionsRef}
            deleteOption={() => {
              setShowStatusOptions(false);
              setShowDeleteMsg(true);
            }}
          />
        ) : (
          <StatusOptions ref={statusOptionsRef} />
        ))}
      {showDeleteMsg && <DeleteMessage statusId={statues[idx].id} ref={deleteMsgRef} close={() => setShowDeleteMsg(false)} />}
      <div className="progress-bar">
        <StatusProgressBar count={statues.length} activeIndex={idx} />
      </div>
      <div className="status-page-heading">
        <div className="status-profile">
          <div className="avtar">
            <img
              src={statues[0].user.avtar}
              alt={statues[0].user.firstname + " profile"}
            />
          </div>
          <div className="info">
            <span className="status-owner-name">
              {statues[0].user.firstname + " " + statues[0].user.lastname}
            </span>
            <span className="status-created-time">
              {statues[idx].createdAt}
            </span>
          </div>
          <div className="action-btns">
            {statues[idx].type === "VIDEO" && (
              <>
                <div className="status-btn">
                  {isPlay ? (
                    <FontAwesomeIcon
                      icon={faPlay}
                      onClick={() => {
                        videoRef.current.pause();
                        setIsPlay(false);
                      }}
                    />
                  ) : (
                    <FontAwesomeIcon
                      icon={faPause}
                      onClick={() => {
                        videoRef.current.play();
                        setIsPlay(true);
                      }}
                    />
                  )}
                </div>
                <div className="status-btn">
                  {isMute ? (
                    <FontAwesomeIcon
                      icon={faVolumeXmark}
                      onClick={() => setIsMute(false)}
                    />
                  ) : (
                    <FontAwesomeIcon
                      icon={faVolumeHigh}
                      onClick={() => setIsMute(true)}
                    />
                  )}
                </div>
              </>
            )}
            <div
              className="status-btn"
              onClick={() => setShowStatusOptions(true)}
            >
              <FontAwesomeIcon icon={faEllipsisVertical} />
            </div>
            <div className="status-btn" onClick={() => navigate("/c")}>
              <FontAwesomeIcon icon={faXmark} />
            </div>
          </div>
        </div>
      </div>
      <div className="status-content">
        {statues[idx].type === "IMAGE" && (
          <div className="media-content">
            <img
              src={statues[idx].mediaUrl}
              alt={
                statues[idx].user.firstname +
                " " +
                statues[idx].user.lastname +
                " status"
              }
            />
          </div>
        )}

        {statues[idx].type === "VIDEO" && (
          <div className="media-content">
            <video
              src={statues[idx].mediaUrl}
              alt={
                statues[idx].user.firstname +
                " " +
                statues[idx].user.lastname +
                " status"
              }
              ref={videoRef}
              autoPlay
              muted={isMute}
              loop
            />
          </div>
        )}

        {statues[idx].type === "TEXT" && (
          <div className="text-contain">
            <span style={{ fontFamily: statues[idx].textStyle }}>
              {statues[idx].text}
            </span>
          </div>
        )}

        {isOwner && !showViewers && (
          <div className="viwers" onClick={() => setShowViewers(true)}>
            <FontAwesomeIcon icon={faEye} />
          </div>
        )}
        {statues[idx].caption != null && statues[idx].caption != "null" && (
          <div className="status-caption-section">
            <span className="status-caption">{statues[idx].caption}</span>
          </div>
        )}
      </div>
    </div>
  );
}

const OwnStatusOptions = ({ ref, deleteOption }) => {
  return (
    <div className="status-popup" ref={ref}>
      <div className="status-option" onClick={deleteOption}>
        Delete
      </div>
    </div>
  );
};

const StatusOptions = ({ ref }) => {
  return (
    <div className="status-popup" ref={ref}>
      <div className="status-option">Report</div>
      <div className="status-option">Mute</div>
    </div>
  );
};

const DeleteMessage = ({ ref, close, statusId }) => {
  const connectedUser = useSelector(state => state.authentication);
  const navigate = useNavigate();

  const handleStatusDelete = async () => {
    const statusResponse = await StatusService.deleteStatusById(statusId, connectedUser.authToken);
    if (!statusResponse.success) {
      toast.error("Failed to delete the status!");
      return;
    }
    console.log(statusResponse);
    navigate("/c");
  }

  return (
    <div className="status-delete-message" ref={ref}>
      <div className="status-delete-message-heading">
        Delete 1 status update
      </div>
      <div className="status-delete-msg-body">
        Delete this status update? It will also be deleted for everyone who
        received it.
      </div>
      <div className="status-delete-btns">
        <div className="cancel-btn" onClick={close}>Cancel</div>
        <div className="delete-btn" onClick={handleStatusDelete}>Delete</div>
      </div>
    </div>
  );
};

export default Status;
