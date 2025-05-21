import React from "react";
import "../../styles/AvtarOptions.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faFolderOpen,
  faTrashCan,
} from "@fortawesome/free-regular-svg-icons";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { useDropzone } from "react-dropzone";
import UserService from "../../service/UserService";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { login } from "../../store/authSlice";

function AvtarOptions({ position, ref, close, setIsShowRemoveProfile }) {
  const connectedUser = useSelector((state) => state.authentication);
  const dispatch = useDispatch();
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
    },
    onDrop: (files) => {
      handleUploadAvtar(files[0]);
    },
  });

  const handleUploadAvtar = async (file) => {
    close();
    console.log(file);
    const avtarResponse = await UserService.uploadAvtar(
      file,
      connectedUser.authToken
    );
    if (!avtarResponse.success) {
      toast.error("Failed to upload the profile image");
      return;
    }
    const updatedUser = avtarResponse.response;
    console.log(avtarResponse);
    dispatch(
      login({
        id: connectedUser.id,
        fullName: connectedUser.fullName,
        email: connectedUser.email,
        isAuthenticated: connectedUser.isAuthenticated,
        authToken: connectedUser.authToken,
        avtar: updatedUser.avtar,
      })
    );
  };

  return (
    <div
      className="set-actar-container"
      ref={ref}
      style={{
        top: position.x,
        left: position.y,
        transform: "translateY(-100%)",
        marginTop: "-8px",
      }}
    >
      <div className="avtar-options">
        <div className="a-option">
          <FontAwesomeIcon icon={faEye} /> View photo
        </div>
        <div className="a-option">
          <FontAwesomeIcon icon={faCamera} /> Take photo
        </div>
        <div className="a-option" {...getRootProps()}>
          <input {...getInputProps()} />
          <FontAwesomeIcon icon={faFolderOpen} /> Upload photo{" "}
        </div>
        <div
          className="a-option remove"
          onClick={() => {
            close();
            setIsShowRemoveProfile(true);
          }}
        >
          <FontAwesomeIcon icon={faTrashCan} /> Remove photo
        </div>
      </div>
    </div>
  );
}

export default AvtarOptions;
