import {
    faCrop,
    faFilter,
    faPen,
    faSmile,
    faT,
    faXmark,
  } from "@fortawesome/free-solid-svg-icons";
  import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
  import React from "react";
  import "../../styles/DisplayFile.css";
  
  function DisplayFile({ file, setFile, sendFileHandler, setCaption, caption }) {
    return (
      <div className="display-file-container">
        <div className="header">
          <div className="options">
            <button className="option" onClick={() => setFile(null)}>
              <FontAwesomeIcon icon={faXmark} />
            </button>
            {file.type.startsWith("image/") && (
              <>
                <button className="option">
                  <FontAwesomeIcon icon={faCrop} />
                </button>
                <button className="option">
                  <FontAwesomeIcon icon={faFilter} />
                </button>
                <button className="option">
                  <FontAwesomeIcon icon={faPen} />
                </button>
                <button className="option">
                  <FontAwesomeIcon icon={faT} />
                </button>
              </>
            )}
          </div>
        </div>
        <div className="main">
          {file.type.startsWith("image/") ? (
            <img src={URL.createObjectURL(file)} alt="Preview" />
          ) : file.type.startsWith("video/") ? <video src={URL.createObjectURL(file)} controls /> : (
            <span className="no-preview">No preview found</span>
          )}
        </div>
        <div className="send-section">
          <div className="caption1">
            <input
              type="text"
              placeholder="Add a caption..."
              value={caption}
              onChange={(event) => setCaption(event.target.value)}
            />
            <button className="emoji-btn">
              <FontAwesomeIcon icon={faSmile} />
            </button>
          </div>
          <div className="send-btn">
            <button onClick={sendFileHandler}>
              <svg
                viewBox="0 0 24 24"
                height="24"
                width="24"
                preserveAspectRatio="xMidYMid meet"
                version="1.1"
                x="0px"
                y="0px"
                enableBackground="new 0 0 24 24"
              >
                <title>Send</title>
                <path
                  fill="currentColor"
                  d="M1.101,21.757L23.8,12.028L1.101,2.3l0.011,7.912l13.623,1.816L1.112,13.845 L1.101,21.757z"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  export default DisplayFile;