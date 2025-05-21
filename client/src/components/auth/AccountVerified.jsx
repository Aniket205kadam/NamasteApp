import React, { useState } from "react";
import "../../styles/AccountVerified.css";
import { useNavigate, useParams } from "react-router-dom";
import AuthService from "../../service/AuthService";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../store/authSlice";

function AccountVerified() {
  const { email } = useParams();
  const [isDisplayLogin, setIsDisplayLogin] = useState(false);

  return (
    <div className="page-container">
      <div className="card">
        <div className="header">
          <div className="image">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <path
                  d="M20 7L9.00004 18L3.99994 13"
                  stroke="#000000"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>{" "}
              </g>
            </svg>
          </div>
          {!isDisplayLogin && (
            <>
              <div className="content">
                <span className="title">Account Verified!</span>
                <p className="message">
                  Your account has been successfully verified. You can now log
                  in and start using the app.
                </p>
              </div>
              <div className="actions">
                <button
                  className="continue"
                  type="button"
                  style={{ cursor: "pointer" }}
                  onClick={() => setIsDisplayLogin(true)}
                >
                  Continue
                </button>
              </div>
            </>
          )}
          {isDisplayLogin && <Login email={email} />}
        </div>
      </div>
    </div>
  );
}

const Login = ({ email }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const auth = useSelector((state) => state.authentication);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loginHandler = async () => {
    const loginResponse = await AuthService.login({ email, password });
    if (!loginResponse.success) {
      if (loginResponse.error.validationError) {
        setError(loginResponse.error.validationError[0]);
        return;
      } else if (loginResponse.error.message) {
        setError("Invalid password! Please double-check and try again.");
        return;
      }
    }
    if (loginResponse.response) {
      dispatch(
        login({
          ...auth,
          authToken: loginResponse.response.token,
          isAuthenticated: true,
        })
      );
      // redirect to the home page
      navigate("/c")
    }
  };

  return (
    <div className="content">
      <span className="login">Login</span>
      <p>Enter your password to complete sign up process</p>
      <div className="email">
        <label htmlFor="email">Email: </label>
        <input type="text" id="email" value={email} disabled />
      </div>
      <div className="password">
        <label htmlFor="password">Password: </label>
        <input
          type="password"
          id="password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        {error && <p className="error-msg">*{error}</p>}
      </div>
      <button className="continue" type="submit" onClick={loginHandler}>
        Processed
      </button>
    </div>
  );
};

export default AccountVerified;
