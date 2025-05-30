import StatusProgressBar from "./StatusProgressBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisVertical,
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

function Status({ statues, idx }) {
  const [isPlay, setIsPlay] = useState(true);
  const [isMute, setIsMute] = useState(false);
  const videoRef = useRef(null);
  const navigate = useNavigate();

  console.log(statues);

  return (
    <div className="status">
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
              {statues[0].user.firstname + " " + statues[0].user.firstname}
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
            <div className="status-btn">
              <FontAwesomeIcon icon={faEllipsisVertical} />
            </div>
            <div className="status-btn" onClick={() => navigate('/c')}>
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
          <div
            className="text-contain"
            style={{ backgroundColor: statues[idx].bgColor }}
          >
            <span>{statues[idx].text}</span>
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

export default Status;
