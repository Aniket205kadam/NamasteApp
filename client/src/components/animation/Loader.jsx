import React from "react";
import "../../styles/Loader.css";

function Loader({ width = "2.25em" }) {
  return (
    <svg viewBox="25 25 50 50" className="loader" style={{ width: width }}>
      <circle r="20" cy="50" cx="50" className="part"></circle>
    </svg>
  );
}

export default Loader;
