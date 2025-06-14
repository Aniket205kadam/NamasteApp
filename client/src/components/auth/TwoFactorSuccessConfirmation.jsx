import React from "react";

const TwoFactorSuccessConfirmation = ({
  fullName,
  onViewBackupCodes,
  onDone,
}) => {
  return (
    <div className="two-factor-success">
      <header className="success-heading">
        <h2>{fullName} • NamasteApp</h2>
        <h3>Two-factor authentication is on</h3>
      </header>

      <div className="success-body">
        <p>
          We'll now ask for a login code anytime you log in on a device we don't
          recognize. To change your contact info, go to the Personal details
          section in Accounts Center.
        </p>

        <p>
          See your list of{" "}
          <button
            type="button"
            onClick={onViewBackupCodes}
            className="backup-code-btn"
          >
            backup codes
          </button>
        </p>
      </div>

      <button onClick={onDone} className="done-btn">
        Done
      </button>
    </div>
  );
};

//The authentication app security method is ON

export default TwoFactorSuccessConfirmation;
