import { useState } from "react";
import "../../styles/TfaMethodSelection.css";
import AuthenticationSetup from "./AuthenticatorSetup";
import { useSelector } from "react-redux";

const TfaMethodSelection = ({ onClose }) => {
  const [selectedMethod, setSelectedMethod] = useState("AUTHENTICATOR_APP");
  const [isShowAuthenticatorSetup, setIsShowAuthentocatorSetup] = useState(false);
  const [isShowEmailSetup, setIsShowEmailSetup] = useState();
  const connectedUser = useSelector((state) => state.authentication);

  const selectTfaMethod = async () => {
    console.log("1");
    if (selectedMethod === "AUTHENTICATOR_APP") {
      console.log("2");
      setIsShowAuthentocatorSetup(true);
    } else if (selectedMethod === "REGISTERED_EMAIL") {
      console.log("3");
      setIsShowEmailSetup(true);
    }
  };

  if (isShowAuthenticatorSetup) {
    return <AuthenticationSetup onClose={onClose} />
  } 
  if (isShowEmailSetup) {

  }

  return (
    <div className="tfa-page">
      <header className="tfa-header">
        <h5>{connectedUser.fullName} • NamasteApp</h5>
        <h2>Help protect your account</h2>
        <p>
          Set up two-factor authentication and we'll send you a notification to
          check it's you if someone logs in from a device we don't recognize.
        </p>
      </header>

      <section className="tfa-options">
        <h4 className="tfa-options-heading">
          Choose how you want to receive your authentication code
        </h4>

        <label className="tfa-option">
          <input
            type="radio"
            name="tfa-method"
            value="AUTHENTICATOR_APP"
            checked={selectedMethod === "AUTHENTICATOR_APP"}
            onChange={(e) => setSelectedMethod(e.target.value)}
          />
          <div>
            <div className="tfa-option-heading">Authentication App</div>
            <p>
              Get one-time codes from apps like Google Authenticator or Duo
              Mobile.
            </p>
            <p style={{ color: "#6bed78" }}>Recommended</p>
          </div>
        </label>

        <label className="tfa-option">
          <input
            type="radio"
            name="tfa-method"
            value="REGISTERED_EMAIL"
            checked={selectedMethod === "REGISTERED_EMAIL"}
            onChange={(e) => setSelectedMethod(e.target.value)}
          />
          <div>
            <div className="tfa-option-heading">Email</div>
            <p>Receive your login code via your registered email address.</p>
          </div>
        </label>
      </section>

      <footer className="tfa-btns">
        {!connectedUser.isAuthenticated && (
          <button className="tfa-skip-btn" onClick={skipTfa}>
            Skip
          </button>
        )}
        <button
          className="tfa-continue"
          disabled={!selectedMethod}
          onClick={selectTfaMethod}
        >
          Continue
        </button>
      </footer>
    </div>
  );
};

export default TfaMethodSelection;
