import React, { useEffect, useState } from "react";
import "../../styles/EmailVerification.css";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "../animation/Loading";
import authService from "../../service/AuthService";

function EmailVerification() {
  const { email } = useParams();
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const [isExpired, setIsExpired] = useState(false);
  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
    const otpResponse = await authService.emailVerification(email, otp);
    if (!otpResponse.success) {
      toast.error(otpResponse.error || "Failed to verifiy the email!");
      return;
    }
    toast.success("Successfuly verify the email!");
    navigator
  };

  useEffect(() => {
    if (otp.length === 6) {
      toast.info(otp);
      setLoading(true);
    }
  }, [otp]);

  // handle OTP timer
  useEffect(() => {
    if (timeLeft <= 0) {
      setIsExpired(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime === 0 ? 0 : prevTime - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  return (
    <div className="page-container">
      <form className="form-card">
        <p className="form-card-title">
          We've sent a verification code to your email
        </p>
        <p className="form-card-prompt">
          Enter the 6-digit verification code sent to your email address
        </p>
        <div className="form-card-input-wrapper">
          <input
            className="form-card-input"
            placeholder="______"
            maxLength="6"
            type="tel"
            value={otp}
            onChange={(event) => setOtp(event.target.value)}
            disabled={otp.length === 6}
          />
          <div className="form-card-input-bg"></div>
          {loading && (
            <div className="loading">
              <Loading />
            </div>
          )}
        </div>
        {!isExpired && (
          <p className="timer">
            Time left:{" "}
            <span className={`${timeLeft < 10 ? "time" : ""}`}>
              {timeLeft}s
            </span>
          </p>
        )}
        {isExpired && (
          <p className="send-otp">
            Didn't receive the code?{" "}
            <span className="underlined">Resend email</span>
          </p>
        )}
      </form>
      {/* <div className="wrapper">
        <OtpExpired />
      </div> */}
    </div>
  );
}

const OtpExpired = () => {
  return (
    <div className="card">
      <div className="card-content">
        <p className="card-heading">OTP Expired</p>
        <p className="card-description">
          Your one-time password has expired. Please request a new one to
          continue.
        </p>
      </div>
      <div className="card-button-wrapper">
        <button className="card-button primary">Resend OTP</button>
      </div>
      <button className="exit-button">
        <svg height="20px" viewBox="0 0 384 512">
          <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"></path>
        </svg>
      </button>
    </div>
  );
};

export default EmailVerification;
