import React from "react";
import "../../styles/ChatLoading.css";

function ChatLoading() {
  return (
    <div className="__loader">
      <div className="wrapper">
        <div className="circle"></div>
        <div className="line-1"></div>
        <div className="line-2"></div>
        {/* <div className="line-3"></div>
        <div className="line-4"></div> */}
      </div>
    </div>
  );
}

export default ChatLoading;
