import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import TfaMethodSelection from "../2fa/TfaMethodSelection";
import { useSelector } from "react-redux";
import "../../styles/PasswordAndSecurity.css";

function PasswordAndSecurity() {
  const connectedUser = useSelector((state) => state.authentication);
  const [isShow2FAMethods, setIsShow2FAMethods] = useState(false);

  return (
    <div className="password-and-security-container">
      {isShow2FAMethods && (
        <div className="tfa-method-selection">
          <button onClick={() => setIsShow2FAMethods(false)}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
          <div className="tfa-method-content">
            <TfaMethodSelection onClose={() => setIsShow2FAMethods(false)} />
          </div>
        </div>
      )}

      <div className="passsword-and-security-heading">
        <button>
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <span>Password and security</span>
      </div>

      <div className="password-and-security-options">
        <div className="password-and-security-option">Change password</div>
        <div
          className="password-and-security-option"
          onClick={() => setIsShow2FAMethods(true)}
        >
          Two-factor authentication
        </div>
      </div>
    </div>
  );
}

export default PasswordAndSecurity;
