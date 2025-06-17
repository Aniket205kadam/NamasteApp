import "../../styles/TfaOnMessage.css";

const TfaOnMessage = ({ onClose }) => {
  return (
    <div className="tfa-on-message">
      <div className="tfa-on-message-heading">
        Two-factor authentication is on
      </div>
      <p className="tfa-on-message-info">
        We'll now ask for a login code anytime you log in on a device we don't
        recognize.
      </p>
      <p className="tfa-backup-code">
        See your list of <span className="backup-code">backup codes</span>
      </p>
      <button className="tfa-done" onClick={onClose}>Done</button>
    </div>
  );
};

export default TfaOnMessage;