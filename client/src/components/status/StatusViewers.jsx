import React, { useEffect, useRef, useState } from "react";
import statusService from "../../service/StatusService";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import "../../styles/StatusViewers.css";
import useClickOutside from "../../hooks/useClickOutside"

function StatusViewers({ statusId, ref }) {
  const connectedUser = useSelector((state) => state.authentication);
  const [viewers, setViewers] = useState([]);

  const fetchStatusViewers = async () => {
    const statusResponse = await statusService.getViewers(
      statusId,
      connectedUser.authToken
    );
    if (!statusResponse.success) {
      toast.error("Failed to fetch the viewers!");
      return;
    }
    console.log("Viewers: ", statusResponse);
    setViewers(statusResponse.response);
  };

  useEffect(() => {
    fetchStatusViewers();
  }, []);

  return (
    <div className="status-viewers" ref={ref}>
      {viewers.map((viewer) => (
        <div className="viewer">
          <div className="viewer-avtar">
            <img src={viewer.avtar} alt={viewer.email} />
          </div>
          <div className="viewer-info">
            <span className="viewer-name">
              {viewer.firstname + " " + viewer.lastname}
            </span>
            <span className="viewer-about">{viewer.about}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default StatusViewers;
