import React from "react";

const AuthenticatorSetup = ({ fullName, qrCodeUrl, setupKey }) => {
  return (
    <div className="authentication-app">
      {/* Header */}
      <header className="authentication-app-heading">
        <h2>{fullName} • NamasteApp</h2>
        <h3>Instructions for setup</h3>
      </header>

      <ol className="authentication-app-steps">
        {/* Step 1 */}
        <li className="authentication-app-step">
          <h4>1. Download an authentication app</h4>
          <p>
            We recommend downloading Duo Mobile or Google Authenticator if you
            don't already have one installed.
          </p>
        </li>

        {/* Step 2 */}
        <li className="authentication-app-step">
          <h4>2. Scan this QR code or enter the setup key</h4>
          <p>
            Open your authentication app and scan this QR code. If you can't scan it,
            manually enter the setup key.
          </p>

          <div className="key-options">
            <div className="qr-code-image">
              <img src={qrCodeUrl} alt="Scan this QR code with your app" />
            </div>
            <div className="setup-key">
              <span className="tfa-setup-code">{setupKey}</span>
              <button className="copy-setup-code" onClick={() => navigator.clipboard.writeText(setupKey)}>
                Copy key
              </button>
            </div>
          </div>
        </li>

        {/* Step 3 */}
        <li className="authentication-app-step">
          <h4>3. Enter the 6-digit code</h4>
          <p>
            After scanning or entering the key, your app will show a 6-digit code.
            Enter that code on the next screen to complete setup.
          </p>
        </li>
      </ol>

      <div className="tfa-btns">
        <button className="next-btn">Next</button>
      </div>
    </div>
  );
};

export default AuthenticatorSetup;
