import "../../styles/StatusProgressBar.css"

function StatusProgressBar({ count, activeIndex }) {
  return (
    <div className="progress-container">
      {Array.from({ length: count }).map((_, index) => (
        <div
          className={`progress-segment ${index <= activeIndex ? "active" : ""}`}
          key={index}
        ></div>
      ))}
    </div>
  );
}

export default StatusProgressBar;
