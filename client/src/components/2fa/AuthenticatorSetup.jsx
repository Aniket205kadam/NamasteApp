import { useEffect, useState } from "react";
import "../../styles/AuthenticatorSetup.css";
import AuthenticatorAppCodeInput from "./AuthenticatorAppCodeInput";
import UserService from "../../service/UserService";
import { useSelector } from "react-redux";
import Loader from "../animation/Loader";

const AuthenticatorSetup = ({ onClose }) => {
  const connectedUser = useSelector((state) => state.authentication);
  const [isShowCodeInput, setIsShowCodeInput] = useState(false);
  const [isError, setIsError] = useState(false);
  const [secreteResponse, setSecreteResponse] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchQrCode = async () => {
    setLoading(true);
    setIsError(false);
    const tfaResponse = await UserService.generateAuthenticatorSecrete(
      connectedUser.authToken
    );
    if (!tfaResponse.success) {
      setLoading(false);
      setIsError(true);
      return;
    }
    setSecreteResponse(tfaResponse.response);
    setLoading(false);
  };

  useEffect(() => {
    fetchQrCode();
  }, [connectedUser]);

  return (
    <>
      {isShowCodeInput ? (
        <AuthenticatorAppCodeInput secrete={secreteResponse.secrete} onClose={onClose} />
      ) : (
        <div className="authentication-app">
          <header className="authentication-app-heading">
            <h5>{connectedUser.fullName} • NamasteApp</h5>
            <h2>Instructions for setup</h2>
          </header>

          <ol className="authentication-app-steps">
            <li className="authentication-app-step">
              <h4>Download an authentication app</h4>
              <p>
                We recommend downloading Duo Mobile or Google Authenticator if
                you don't already have one installed.
              </p>
            </li>

            <li className="authentication-app-step">
              <h4>Scan this QR code or enter the setup key</h4>
              <p>
                Open your authentication app and scan this QR code. If you can't
                scan it, manually enter the setup key.
              </p>

              {loading ? (
                <Loader />
              ) : (
                <div className="key-options">
                  {isError ? (
                    <div
                      style={{ color: "red", cursor: "pointer" }}
                      onClick={() => fetchQrCode()}
                    >
                      try again
                    </div>
                  ) : (
                    <>
                      <div className="qr-code-image">
                        <img
                          src={secreteResponse.qrCodeImage}
                          alt="Scan this QR code with your app"
                        />
                      </div>
                      <div className="setup-key">
                        <span className="tfa-setup-code">
                          {secreteResponse.secrete}
                        </span>
                        <button
                          className="copy-setup-code"
                          onClick={() =>
                            navigator.clipboard.writeText(secreteResponse.secrete)
                          }
                        >
                          Copy key
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </li>

            <li className="authentication-app-step">
              <h4>Enter the 6-digit code</h4>
              <p>
                After scanning or entering the key, your app will show a 6-digit
                code. Enter that code on the next screen to complete setup.
              </p>
            </li>
          </ol>

          <div className="tfa-btns">
            <button
              className="next-btn"
              onClick={() => setIsShowCodeInput(true)}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AuthenticatorSetup;
