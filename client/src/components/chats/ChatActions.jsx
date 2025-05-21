import React from 'react'
import "../../styles/MessageActions.css";

function ChatActions({position, ref}) {
  return (
    <div
      className="message-action-container"
      ref={ref}
      style={{ top: position.y, left: position.x }}
    >
      <div className="_options">
        <div className="_option">Contact info</div>
        <div className="_option">Clear chat</div>
        <div className="_option">Delete chat</div>
      </div>
    </div>
  )
}

export default ChatActions