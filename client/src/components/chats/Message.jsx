import {
  faAngleDown,
  faBackward,
  faCheck,
  faCheckDouble,
  faCamera,
  faChevronDown,
  faDownload,
  faFile,
  faFileDownload,
  faForward,
  faPause,
  faPlay,
  faSmile,
  faVideo,
  faBan,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useChatTimeConvertor from "../../hooks/useChatTimeConvertor";
import MessageActions from "./MessageActions";
import useClickOutside from "../../hooks/useClickOutside";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import UserService from "../../service/UserService";
import ChatService from "../../service/ChatService";
import GIFLogo from "./GIFLogo";
import { logout } from "../../store/authSlice";

function Message({ message, setReply, chatId, setShowDelete }) {
  const connectedUser = useSelector((state) => state.authentication);
  const [showActions, setShowActions] = useState(false);
  const [actionPosition, setActionPosition] = useState({ x: 0, y: 0 });
  const actionRef = useRef(null);
  const [parentMsg, setParentMsg] = useState(null);
  const [replyMsgSender, setReplyMsgSender] = useState(null);
  const dispatch = useDispatch();

  useClickOutside(actionRef, () => setShowActions(false));

  const handleContextMenu = (event) => {
    event.preventDefault();
    const { clientX, clientY } = event;
    const { innerWidth, innerHeight } = window;

    const x = clientX + 200 > innerWidth ? clientX - 200 : clientX;
    const y = clientY + 250 > innerHeight ? clientY - 250 : clientY;

    setActionPosition({ x, y });
    setShowActions(true);
  };

  const handleDownload = async () => {
    const filename = `NamasteApp ${
      message.type === "UNKNOWN" ? "file" : message.type
    } ${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()} at ${new Date().getHours()}:${new Date().getMinutes()} ${
      new Date().getHours() >= 12 ? "PM" : "AM"
    }`;
    if (message.media) {
      const zip = new JSZip();
      const base64Data = message.media.split(",")[1];
      zip.file(filename, base64Data, { base64: true });
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `${filename}.zip`);
    } else {
      //GIF
      const response = await fetch(message.gifUrl);
      const blob = await response.blob();
      saveAs(blob, filename);
    }
  };

  const fetchMessage = async () => {
    const chatResponse = await ChatService.findMessageById(
      message.replyId,
      connectedUser.authToken
    );
    setParentMsg(chatResponse.response);
  };

  const fetchUserById = async () => {
    const userResponse = await UserService.findUserById(
      parentMsg.senderId,
      connectedUser.authToken
    );
    if (!userResponse.success) {
      toast.error("Failed to fetch the user");
      if (userResponse.status === 403 || userResponse.status === 401) {
        dispatch(logout());
      }
      return;
    }
    setReplyMsgSender(userResponse.response);
  };

  useEffect(() => {
    if (message.replyId) {
      fetchMessage();
    }
  }, []);

  useEffect(() => {}, [replyMsgSender]);

  useEffect(() => {
    if (parentMsg) {
      fetchUserById();
    }
  }, [parentMsg]);

  if (message.deleted) {
    return (
      <div
        className={`_message ${
          connectedUser.id === message.senderId ? "message--own" : ""
        }`}
        onContextMenu={handleContextMenu}
      >
        <div className="message__container ">
          <div className="message__content">
            <p className="message__text" style={{ color: "#bcbec2" }}>
              {message.senderId === connectedUser.id ? (
                <span>
                  <FontAwesomeIcon icon={faBan} style={{paddingRight: "4px"}} />
                  <i>You deleted this message</i>
                </span>
              ) : (
                <span>
                  <FontAwesomeIcon icon={faBan} style={{paddingRight: "4px"}} />
                  <i>This message was deleted</i>
                </span>
              )}
            </p>
            <div className="message__meta">
              <span className="message__time">
                {useChatTimeConvertor(message.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (message.receiverId === connectedUser.id && message.deletedFromReceiver) {
    return;
  }

  if (message.replyId) {
    if (parentMsg != null && replyMsgSender != null) {
      return (
        <div
          className={`_reply-message ${
            connectedUser.id === message.senderId ? "message--own" : ""
          }`}
          onContextMenu={handleContextMenu}
        >
          <div className="reply1">
            <>
              <div className="info-section1">
                <span
                  className="msg-sender1"
                  style={
                    replyMsgSender.id === connectedUser.id
                      ? { color: "#3d72e3" }
                      : { color: "#00a884" }
                  }
                >
                  {replyMsgSender.id === connectedUser.id
                    ? "You"
                    : `${replyMsgSender.firstname} ${replyMsgSender.lastname}`}
                </span>
                <div className="msg1">
                  {parentMsg.type === "TEXT" ? (
                    <span>{parentMsg.content}</span>
                  ) : parentMsg.type === "IMAGE" || parentMsg.type === "GIF" ? (
                    <div className="content-type">
                      {parentMsg.type === "GIF" ? (
                        <>
                          <GIFLogo />
                          GIF
                        </>
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faCamera} />
                          Photo
                        </>
                      )}
                    </div>
                  ) : parentMsg.type === "VIDEO" ? (
                    <div className="content-type1">
                      <FontAwesomeIcon icon={faVideo} />
                      Video
                    </div>
                  ) : (
                    <div className="content-type1">
                      <FontAwesomeIcon icon={faFile} />
                      {parentMsg.fileOriginalName}
                    </div>
                  )}
                </div>
              </div>
              {!(parentMsg.type === "TEXT" || parentMsg.type === "UNKNOWN") && (
                <div className="media-preview1">
                  {parentMsg.type === "IMAGE" || parentMsg.type === "GIF" ? (
                    <img
                      src={
                        parentMsg.type === "IMAGE"
                          ? parentMsg.media
                          : parentMsg.gifUrl
                      }
                    />
                  ) : (
                    <video src={parentMsg.media} />
                  )}
                </div>
              )}
            </>
          </div>
          <TextMessage message={message} />
          <div
            className="message-more"
            onClick={(event) => {
              event.preventDefault();
              handleContextMenu(event);
            }}
            style={{ cursor: "pointer" }}
          >
            <FontAwesomeIcon
              icon={faAngleDown}
              color={`${
                message.type === "TEXT" || message.type === "UNKNOWN"
                  ? "#5e5f61"
                  : ""
              }`}
            />
          </div>
          {showActions && (
            <MessageActions
              position={actionPosition}
              ref={actionRef}
              isText={message.type === "TEXT"}
              isOwnMessage={connectedUser.id === message.senderId}
              handleDownload={handleDownload}
              closeAction={() => setShowActions(false)}
              message={message}
              setReply={setReply}
              setShowDelete={setShowDelete}
            />
          )}
        </div>
      );
    } else {
      return <span>Loading</span>;
    }
  }

  return (
    <div
      className={`_message ${
        connectedUser.id === message.senderId ? "message--own" : ""
      }`}
      onContextMenu={handleContextMenu}
    >
      {message.type === "TEXT" && <TextMessage message={message} />}
      {message.type === "IMAGE" && <ImageMessage message={message} />}
      {message.type === "VIDEO" && <VideoMessage message={message} />}
      {message.type === "GIF" && <GIFMessage message={message} />}
      {message.type === "UNKNOWN" && <FileMessage message={message} />}

      <div
        className="message-more"
        onClick={(event) => {
          event.preventDefault();
          handleContextMenu(event);
        }}
        style={{ cursor: "pointer" }}
      >
        <FontAwesomeIcon
          icon={faAngleDown}
          color={`${
            message.type === "TEXT" || message.type === "UNKNOWN"
              ? "#5e5f61"
              : ""
          }`}
        />
      </div>
      {showActions && (
        <MessageActions
          position={actionPosition}
          ref={actionRef}
          isText={message.type === "TEXT"}
          isOwnMessage={connectedUser.id === message.senderId}
          handleDownload={handleDownload}
          closeAction={() => setShowActions(false)}
          message={message}
          setReply={setReply}
          setShowDelete={setShowDelete}
        />
      )}
    </div>
  );
}

const ImageMessage = ({ message }) => {
  const connectedUser = useSelector((state) => state.authentication);
  const createdAt = useChatTimeConvertor(message.createdAt);

  return (
    <div className="message__container">
      <div
        className="message__content message__content--image"
        style={{ backgroundColor: "inherit" }}
      >
        <img src={message.media} alt="content" className="message__image" />
        <div
          className="message__meta"
          style={{ position: "relative", bottom: "20px" }}
        >
          <span className="message__time" style={{ color: "#ffffff" }}>
            {createdAt}
          </span>
          {connectedUser.id === message.senderId && (
            <span className="message__status" style={{ color: "#ffffff" }}>
              {message.state === "SENT" && <FontAwesomeIcon icon={faCheck} />}
              {message.state === "RECEIVED" && (
                <FontAwesomeIcon icon={faCheckDouble} />
              )}
              {message.state === "SEEN" && (
                <FontAwesomeIcon
                  icon={faCheckDouble}
                  style={{ color: "#53bdeb" }}
                />
              )}
            </span>
          )}
        </div>
        <div className="caption">{message.caption}</div>
      </div>
    </div>
  );
};

const GIFMessage = ({ message }) => {
  const connectedUser = useSelector((state) => state.authentication);
  const createdAt = useChatTimeConvertor(message.createdAt);

  return (
    <div className="message__container">
      <div
        className="message__content message__content--image"
        style={{ backgroundColor: "inherit" }}
      >
        <span className="GIF">GIF</span>
        <img src={message.gifUrl} alt="GIF" className="message__image" />
        <div
          className="message__meta"
          style={{ position: "relative", bottom: "20px" }}
        >
          <span className="message__time" style={{ color: "#ffffff" }}>
            {createdAt}
          </span>
          {connectedUser.id === message.senderId && (
            <span className="message__status" style={{ color: "#ffffff" }}>
              {message.state === "SENT" && <FontAwesomeIcon icon={faCheck} />}
              {message.state === "RECEIVED" && (
                <FontAwesomeIcon icon={faCheckDouble} />
              )}
              {message.state === "SEEN" && (
                <FontAwesomeIcon
                  icon={faCheckDouble}
                  style={{ color: "#53bdeb" }}
                />
              )}
            </span>
          )}
        </div>
        <div className="caption">{message.caption}</div>
      </div>
    </div>
  );
};

const VideoMessage = ({ message }) => {
  const connectedUser = useSelector((state) => state.authentication);
  const createdAt = useChatTimeConvertor(message.createdAt);
  const [isPause, setIsPause] = useState(true);
  const videoRef = useRef(null);

  const toggleVideoHandler = () => {
    if (videoRef.current) {
      if (isPause) {
        setIsPause(false);
        videoRef.current.play();
      } else {
        setIsPause(true);
        videoRef.current.pause();
      }
    }
  };

  // forward the video by 5s
  const forwardHandler = () => {
    if (videoRef.current) {
      videoRef.current.currentTime += 5;
    }
  };

  // backward the video by 5s
  const backwardHandler = () => {
    if (videoRef.current) {
      videoRef.current.currentTime -= 5;
    }
  };

  return (
    <div className="message__container">
      <div
        className="message__content message__content--image"
        style={{ backgroundColor: "inherit" }}
      >
        <div className="video" onClick={toggleVideoHandler}>
          <div className="click-zone left" onClick={backwardHandler}></div>
          <div
            className="click-zone right"
            onDoubleClick={forwardHandler}
          ></div>
          <video src={message.media} ref={videoRef} />
        </div>
        <div
          className="message__meta"
          style={{ position: "relative", bottom: "20px" }}
        >
          <span className="message__time" style={{ color: "#ffffff" }}>
            {createdAt}
          </span>
          {connectedUser.id === message.senderId && (
            <span className="message__status" style={{ color: "#ffffff" }}>
              {message.state === "SENT" && <FontAwesomeIcon icon={faCheck} />}
              {message.state === "RECEIVED" && (
                <FontAwesomeIcon icon={faCheckDouble} />
              )}
              {message.state === "SEEN" && (
                <FontAwesomeIcon
                  icon={faCheckDouble}
                  style={{ color: "#53bdeb" }}
                />
              )}
            </span>
          )}
        </div>
        <div className="caption">{message.caption}</div>
      </div>
    </div>
  );
};

const TextMessage = ({ message }) => {
  const connectedUser = useSelector((state) => state.authentication);

  return (
    <div className="message__container ">
      <div className="message__content">
        <p className="message__text">{message.content}</p>
        <div className="message__meta">
          <span className="message__time">
            {useChatTimeConvertor(message.createdAt)}
          </span>
          {connectedUser.id === message.senderId && (
            <span className="message__status">
              {message.state === "SENT" && <FontAwesomeIcon icon={faCheck} />}
              {message.state === "RECEIVED" && (
                <FontAwesomeIcon icon={faCheckDouble} />
              )}
              {message.state === "SEEN" && (
                <FontAwesomeIcon
                  icon={faCheckDouble}
                  style={{ color: "#53bdeb" }}
                />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const FileMessage = ({ message }) => {
  const getBase64FileSize = (base64String) => {
    const base64Data = base64String.split(",")[1];
    const padding = (base64Data.match(/=+$/) || [""])[0].length;
    const sizeInBytes = (base64Data.length * 3) / 4 - padding;
    return sizeInBytes;
  };

  const getSize = (base64String) => {
    const bytes = getBase64FileSize(base64String);
    const units = ["Bytes", "KB", "MB", "GB"];
    if (bytes === 0) return "0 Bytes";

    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    const size = bytes / Math.pow(1024, i);

    return size.toFixed(0) + " " + units[i];
  };

  const handleDownload = async () => {
    const zip = new JSZip();
    const base64Data = message.media.split(",")[1];
    const filename = message.fileOriginalName;
    zip.file(filename, base64Data, { base64: true });
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, `${filename.split(".")[0]}.zip`);
  };

  return (
    <div className="message-container">
      <div className="file-preview-whatsapp">
        <div className="file-icon">
          <FontAwesomeIcon icon={faFile} className="file-pdf-icon" />
        </div>

        <div className="file-info">
          <span className="file-name">{message.fileOriginalName}</span>
          <span className="file-details">PDF • {getSize(message.media)}</span>
        </div>

        <div className="file-download">
          <FontAwesomeIcon
            icon={faFileDownload}
            className="download-icon"
            onClick={handleDownload}
          />
        </div>
      </div>
    </div>
  );
};

export default Message;
