import { faImages, faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDropzone } from "react-dropzone";
import { useState } from "react";

function StatusOptions({ ref, fileSelected }) {
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

  const uploadPhotoOrVideo = async (file) => {};

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
        <div className="a-option" {...getRootProps()}>
          <input {...getInputProps()} />
          <FontAwesomeIcon icon={faImages} /> Photos & videos
        </div>
        <div className="a-option">
          <FontAwesomeIcon icon={faPen} /> Text
        </div>
      </div>
    </div>
  );
}

export default StatusOptions;
