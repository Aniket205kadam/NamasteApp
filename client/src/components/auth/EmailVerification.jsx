import React, { useEffect, useState } from "react";
import "../../styles/EmailVerification.css";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "../animation/Loading";
import authService from "../../service/AuthService";

function EmailVerification() {
  const { email } = useParams();
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const [isExpired, setIsExpired] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const sendOtp = async () => {
    setLoading(true);
    const otpResponse = await authService.emailVerification(email, otp);
    if (!otpResponse.success) {
      console.log(otpResponse);
      if (otpResponse.error.message.toLowerCase().includes("expired")) {
        toast.warn(
          "Your one-time password (OTP) has expired. A new OTP has been sent to your email."
        );
        setOtp("");
        setLoading(false);
        setTimeLeft(120);
        return;
      } else if (
        otpResponse.error.message
          .toLowerCase()
          .includes("verification code is not found")
      ) {
        setError(otpResponse.error.message);
        setOtp("");
        setLoading(false);
        return;
      } else {
        toast.error(otpResponse.error || "Failed to verifiy the email!");
        setOtp("");
        setLoading(false);
        return;
      }
    }
    toast.success("Successfuly verify the email!");
    setLoading(false);
    navigate(`/success-asuwecwoew12@1slks/${email}`);
  };

  const resendOtpHandler = async () => {
    const otpResponse = await authService.resendOtp(email);
    if (!otpResponse.success) {
      toast.error(otpResponse.error.message || "Failed to resend the mail!");
      return;
    }
    toast.success("Successfully send new One-Time Password (OTP) on your register email address!");
    setTimeLeft(120);
    setOtp("");
    setIsExpired(false);
    setLoading(false);
  };

  useEffect(() => {
    if (otp.length === 6) {
      sendOtp();
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
        {error && (
          <div className="error">
            <span className="error-msg">{error}</span>
          </div>
        )}
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
            <span className="underlined" onClick={resendOtpHandler}>Resend email</span>
          </p>
        )}
      </form>
    </div>
  );
}

export default EmailVerification;
