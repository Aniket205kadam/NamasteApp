import React from "react";
import "../../styles/AccountVerified.css";

function AccountVerified() {
  return (
    <div className="page-container">
      <div class="card">
        <div class="header">
          <div class="image">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <path
                  d="M20 7L9.00004 18L3.99994 13"
                  stroke="#000000"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>{" "}
              </g>
            </svg>
          </div>
          <div class="content">
            <span class="title">Account Verified!</span>
            <p class="message">
              Your account has been successfully verified. You can now log in
              and start using the app.
            </p>
          </div>
          <div class="actions">
            <button class="continue" type="button">
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountVerified;
