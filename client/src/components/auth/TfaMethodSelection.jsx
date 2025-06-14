import React, { useState } from "react";

const TfaMethodSelection = ({ fullName }) => {
  const [selectedMethod, setSelectedMethod] = useState("");

  return (
    <div className="tfa-page">
      {/* Header */}
      <header className="tfa-header">
        <h2>{fullName} • NamasteApp</h2>
        <h3>Help protect your account</h3>
        <p>
          Set up two-factor authentication and we'll send you a notification to
          check it's you if someone logs in from a device we don't recognize.
        </p>
      </header>

      {/* 2FA Method Selection */}
      <section className="tfa-options">
        <h4 className="tfa-options-heading">
          Choose how you want to receive your authentication code
        </h4>

        {/* Authenticator App Option */}
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

        {/* Email Option */}
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

      {/* Action Buttons */}
      <footer className="tfa-btns">
        <button className="tfa-skip-btn">Skip</button>
        <button className="tfa-continue" disabled={!selectedMethod}>
          Continue
        </button>
      </footer>
    </div>
  );
};

export default TfaMethodSelection;
