import React, { useState } from "react";
import EmojiPicker from "emoji-picker-react";
import GIF from "./GIF";
import "../../styles/Emojis.css";

function Emojis({ ref, setMsg, sendGif, inProfile }) {
  const [isDisplayGif, setIsDisplayGif] = useState(false);

  const onSelectGif = (id) => {
    sendGif(id);
  };

  return (
    <div
      className="emojis-container"
      ref={ref}
      style={inProfile ? { bottom: "360px", left: "420px" } : {}}
    >
      {!inProfile && (
        <div className="heading">
          <div className="options">
            <div
              className={`option ${!isDisplayGif ? "active" : ""}`}
              onClick={() => setIsDisplayGif(false)}
            >
              Emoji
            </div>
            <div
              className={`option ${isDisplayGif ? "active" : ""}`}
              onClick={() => setIsDisplayGif(true)}
            >
              GIF
            </div>
          </div>
        </div>
      )}
      <div className="main">
        {isDisplayGif ? (
          <GIF onSelectGif={onSelectGif} />
        ) : (
          <EmojiPicker
            onEmojiClick={(emojiData) => {
              if (inProfile) {
                setMsg((prev) => ({
                  value: prev.value + emojiData.emoji,
                  isEditable: prev.value,
                }));
              } else {
                setMsg((prev) => prev + emojiData.emoji);
              }
            }}
            previewConfig={{ showPreview: false }}
            skinTonesDisabled
            searchDisabled
            theme="light"
            width="100%"
            height="280px"
          />
        )}
      </div>
    </div>
  );
}

export default Emojis;
