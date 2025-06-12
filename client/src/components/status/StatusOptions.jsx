import { faEye, faImages, faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDropzone } from "react-dropzone";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function StatusOptions({
  ref,
  fileSelected,
  setShowTextStatus,
  connectedUserHasStatus,
}) {
  const connectedUser = useSelector(state => state.authentication);
  const navigate = useNavigate();
  const { getInputProps, getRootProps } = useDropzone({
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
      "video/mp4": [".mp4"],
      "video/webm": [".webm"],
      "video/quicktime": [".mov"],
    },
    onDrop: (files) => {
      fileSelected(files[0]);
    },
  });

  return (
    <div
      className="set-actar-container"
      ref={ref}
      style={{
        top: "35%",
        left: "8%",
        transform: "translateY(-100%)",
        marginTop: "-8px",
      }}
    >
      <div className="avtar-options">
        {connectedUserHasStatus && (
          <div className="a-option" onClick={() => navigate(`/status/${connectedUser.id}`)}>
            <FontAwesomeIcon icon={faEye} /> View status
          </div>
        )}
        <div className="a-option" {...getRootProps()}>
          <input {...getInputProps()} />
          <FontAwesomeIcon icon={faImages} /> Photos & videos
        </div>
        <div className="a-option" onClick={() => setShowTextStatus(true)}>
          <FontAwesomeIcon icon={faPen} /> Text
        </div>
      </div>
    </div>
  );
}

export default StatusOptions;
