import {
  faFaceSmile,
  faPalette,
  faPaperPlane,
  faT,
  faTextHeight,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useRef, useState } from "react";
import Emojis from "../chats/Emojis";
import useClickOutside from "../../hooks/useClickOutside";
import statusService from "../../service/StatusService";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import "../../styles/TextStatus.css";

function TextStatus({ close }) {
  const bgColors = [
    "#FF5733",
    "#33C1FF",
    "#28A745",
    "#FFC300",
    "#6F42C1",
    "#E83E8C",
    "#343A40",
    "#17A2B8",
    "#6610F2",
    "#FF6F61",
  ];

  const textStyles = [
    '"Roboto", sans-serif',
    '"Georgia", serif',
    '"Courier New", monospace',
    '"Pacifico", cursive',
    '"Bebas Neue", sans-serif',
  ];

  const connectedUser = useSelector((state) => state.authentication);
  const [currBgIdx, setCurrBgIdx] = useState(0);
  const [currTextStyleIdx, setCurrTextStyleIdx] = useState(0);
  const [showEmojis, setShowEmojis] = useState(false);
  const [statusTxt, setStatusTxt] = useState("");
  const emojisRef = useRef(null);

  useClickOutside(emojisRef, () => setShowEmojis(false));

  const changeBgColor = () => {
    if (currBgIdx === 9) {
      setCurrBgIdx(0);
      return;
    }
    setCurrBgIdx((prev) => prev + 1);
  };

  const changeTextStyle = () => {
    if (currTextStyleIdx === 4) {
      setCurrTextStyleIdx(0);
      return;
    }
    setCurrTextStyleIdx((prev) => prev + 1);
  };

  const uploadTextStatus = async () => {
    if (statusTxt.length === 0) return;
    const statusResponse = await statusService.uploadText(
      statusTxt,
      bgColors[currBgIdx],
      textStyles[currTextStyleIdx],
      connectedUser.authToken
    );
    if (!statusResponse.success) {
      toast.error("Failed to upload the status");
      return;
    }
    toast.success("Successfully upload the status");
    close()
  };

  return (
    <div
      className="enter-text"
      style={{ backgroundColor: bgColors[currBgIdx] }}
    >
      {showEmojis && (
        <Emojis ref={emojisRef} setMsg={setStatusTxt} sendGif={null} inProfile={true} />
      )}

      <div className="text-status-header">
        <div className="left-side">
          <div className="status-close" onClick={close}>
            <FontAwesomeIcon icon={faXmark} />
          </div>
        </div>
        <div className="right-side">
          <div className="text-emoji" onClick={() => setShowEmojis(true)}>
            <FontAwesomeIcon icon={faFaceSmile} />
          </div>
          <div className="text-style" onClick={changeTextStyle}>
            <FontAwesomeIcon icon={faT} />
          </div>
          <div className="color-picker" onClick={changeBgColor}>
            <FontAwesomeIcon icon={faPalette} />
          </div>
        </div>
      </div>
      <div className="text-status-input">
        <input
          type="text"
          placeholder="Type a status"
          style={{ fontFamily: textStyles[currTextStyleIdx] }}
          value={statusTxt}
          onChange={(event) => setStatusTxt(event.target.value)}
        />
      </div>
      <div className="text-status-save">
        <div className="text-send-btn" onClick={uploadTextStatus}>
          <FontAwesomeIcon icon={faPaperPlane} />
        </div>
      </div>
    </div>
  );
}

export default TextStatus;
