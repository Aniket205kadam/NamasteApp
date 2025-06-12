import {
  faArrowLeft,
  faChevronLeft,
  faChevronRight,
  faFaceSmile,
  faPaperPlane,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import Status from "./Status";
import "../../styles/StatusPage.css";
import { useNavigate, useParams } from "react-router-dom";
import statusService from "../../service/StatusService";
import { useDispatch, useSelector } from "react-redux";
import useNotificationTimeConvertor from "../../hooks/useNotificationTimeConvertor";
import useChatTimeConvertor from "../../hooks/useChatTimeConvertor";
import Loader from "../animation/Loader";
import chatService from "../../service/ChatService";
import { toast } from "react-toastify";
import { logout } from "../../store/authSlice";

function StatusPage() {
  const { userId } = useParams();
  const connectedUser = useSelector((state) => state.authentication);
  const [statues, setStatues] = useState([]);
  const [idx, setIdx] = useState(0);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState("");
  const [chatId, setChatId] = useState("");
  const dispatch = useDispatch();

  const fetchStatusByUser = async () => {
    const statusResponse = await statusService.getStatusByUser(
      userId,
      connectedUser.authToken
    );
    console.log(statusResponse);
    if (!statusResponse.success) {
      console.error("Failed to load the status of user, user ID: ", userId);
      if (statusResponse.status === 403 || statusResponse.status === 401) {
        dispatch(logout());
      }
      navigate("/c");
    }
    setStatues(
      statusResponse.response.map((s) => ({
        ...s,
        createdAt: `${useNotificationTimeConvertor(
          s.createdAt
        )}, ${useChatTimeConvertor(s.createdAt)}`,
      }))
    );
    setLoading(false);
  };

  const viewStatus = async (statusId) => {
    const statusResponse = await statusService.viewStatus(
      statusId,
      connectedUser.authToken
    );
    if (!statusResponse.success) {
      console.error("Failed to view the status, status Id: ", statusId);
      if (statusResponse.status === 403 || statusResponse.status === 401) {
        dispatch(logout());
      }
      return;
    }
    console.log("Seen response: ", statusResponse);
    setStatues((prev) =>
      prev.map((status) =>
        status.id === statusId ? { ...status, seen: true } : status
      )
    );
  };

  const fetchChatId = async () => {
    const chatResponse = await chatService.getChatIdBySenderIdAndReciverId(
      connectedUser.id,
      statues[idx].user.id,
      connectedUser.authToken
    );
    if (!chatResponse.success) {
      console.error("Failed to fetch the chat!");
      if (chatResponse.status === 403 || chatResponse.status === 401) {
        dispatch(logout());
      }
      return;
    }
    console.log("Chat Id: ", chatResponse.response);
    setChatId(chatResponse.response);
  };

  const sendReply = async () => {
    const chatResponse = await chatService.sendMessage(
      {
        content: reply,
        senderId: connectedUser.id,
        receiverId: statues[idx].user.id,
        type: "TEXT",
        chatId: chatId,
      },
      connectedUser.authToken
    );
    if (!chatResponse.success) {
      toast.error("Failed to send reply!");
      setReply("");
      if (chatResponse.status === 403 || chatResponse.status === 401) {
        dispatch(logout());
      }
      return;
    }
    setReply("");
    toast.success("Reply sent successfully!");
  };

  useEffect(() => {
    if (!loading) {
      if (!statues[idx].seen) {
        viewStatus(statues[idx].id);
      }
    }
  }, [statues, idx, userId, loading]);

  useEffect(() => {
    fetchStatusByUser();
  }, []);

  useEffect(() => {
    if (statues) {
      fetchChatId();
    }
  }, [statues]);

  return (
    <div className="status-page-warrper" style={{backgroundColor: statues[idx]?.bgColor}}>
      <div className="status-page">
        {idx != 0 && (
          <div
            className="swap-left"
            onClick={() => {
              if (idx != 0) {
                setIdx((prevIdx) => prevIdx - 1);
              }
            }}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </div>
        )}
        <div className="current-status">
          {loading ? <Loader /> : <Status statues={statues} idx={idx} />}
        </div>
        {statues.length > 1 && statues.length - 1 != idx && (
          <div
            className="swap-right"
            onClick={() => {
              if (idx < statues.length - 1) {
                setIdx((prevIdx) => prevIdx + 1);
              }
            }}
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </div>
        )}
      </div>
      <div className="status-reply-section">
        <div className="status-reply">
          <div className="emoji">
            <FontAwesomeIcon icon={faFaceSmile} />
          </div>
          <div className="reply-input">
            <input
              type="text"
              placeholder="Type a reply..."
              value={reply}
              onChange={(event) => setReply(event.target.value)}
            />
          </div>
          <div className="reply-send-btn" onClick={sendReply}>
            <FontAwesomeIcon icon={faPaperPlane} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatusPage;
