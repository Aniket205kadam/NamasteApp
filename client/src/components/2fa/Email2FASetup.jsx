import React, { useState } from "react";

const Email2FASetup = ({ fullName, initialEmail = "" }) => {
  const [email, setEmail] = useState(initialEmail);

  const handleNext = () => {
    console.log("Submitting email:", email);
  };

  return (
    <div className="email-2fa-setup">
      <header className="authentication-app-heading">
        <h2>{fullName} • NamasteApp</h2>
        <h3>Add email address</h3>
        <p>
          Enter your email address and we’ll send you a confirmation code next.
        </p>
      </header>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleNext();
        }}
      >
        <div className="email-input-group">
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            placeholder="yourname@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <p className="email-info">
          We use the email address added here to help you log in, protect our
          community, accurately count people who use our services, and assist
          you in accessing NamasteApp and opt-in programs. Only you will see
          this email on your profile. If the email is used elsewhere across
          NamasteApp, it may also be used for suggesting friends or providing
          ads.
        </p>

        <button type="submit" className="next-btn">
          Next
        </button>
      </form>
    </div>
  );
};

export default Email2FASetup;
