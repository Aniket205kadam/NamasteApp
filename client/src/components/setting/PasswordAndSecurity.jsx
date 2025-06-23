import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import TfaMethodSelection from "../2fa/TfaMethodSelection";
import { useSelector } from "react-redux";
import "../../styles/PasswordAndSecurity.css";
import UserService from "../../service/UserService";
import TwoFactorAuthOption from "../2fa/TwoFactorAuthOption";

function PasswordAndSecurity() {
  const connectedUser = useSelector((state) => state.authentication);
  const [isShow2FAMethods, setIsShow2FAMethods] = useState(false);
  const [isAlready2FAOn, setIsAlready2FAOn] = useState({
    tfaEnabled: false,
    type: null,
  });

  const fetch2faInfo = async () => {
    const tfaResponse = await UserService.isEnabled2FA(connectedUser.authToken);
    if (!tfaResponse.success) {
      console.log("Failed to fetch the user data!");
      return;
    }
    setIsAlready2FAOn(tfaResponse.response);
  };

  useEffect(() => {
    fetch2faInfo();
  }, [connectedUser]);

  return (
    <div className="password-and-security-container">
      {isShow2FAMethods && (
        <div className="tfa-method-selection">
          {!isAlready2FAOn.tfaEnabled && (
            <div className="tfa-method-content">
              <button
                onClick={() => setIsShow2FAMethods(false)}
                className="tfa-close-btn"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
              <TfaMethodSelection onClose={() => setIsShow2FAMethods(false)} setState={setIsAlready2FAOn} />
            </div>
          )}
          {isAlready2FAOn.tfaEnabled && (
            <div className="tfa-method-content">
              <button
                className="tfa-close-btn"
                onClick={() => setIsShow2FAMethods(false)}
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
              <TwoFactorAuthOption
                response={isAlready2FAOn}
                onClose={() => setIsShow2FAMethods(false)}
                state={setIsAlready2FAOn}
              />
            </div>
          )}
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
