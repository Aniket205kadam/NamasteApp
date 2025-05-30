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
import { useSelector } from "react-redux";
import useNotificationTimeConvertor from "../../hooks/useNotificationTimeConvertor";
import useChatTimeConvertor from "../../hooks/useChatTimeConvertor";
import Loader from "../animation/Loader";

function StatusPage() {
  const { userId } = useParams();
  const connectedUser = useSelector((state) => state.authentication);
  const [statues, setStatues] = useState([]);
  const [idx, setIdx] = useState(0);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const fetchStatusByUser = async () => {
    const statusResponse = await statusService.getStatusByUser(
      userId,
      connectedUser.authToken
    );
    if (!statusResponse.success) {
      console.error("Failed to load the status of user, user ID: ", userId);
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
      return;
    }
    console.log("Seen response: ", statusResponse);
    setStatues((prev) =>
      prev.map((status) =>
        status.id === statusId ? { ...status, seen: true } : status
      )
    );
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

  return (
    <div className="status-page-warrper">
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
            <input type="text" placeholder="Type a reply..." />
          </div>
          <div className="reply-send-btn">
            <FontAwesomeIcon icon={faPaperPlane} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatusPage;
