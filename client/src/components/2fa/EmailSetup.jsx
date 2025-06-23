import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "../../styles/EmailSetup.css";
import UserService from "../../service/UserService";
import { toast } from "react-toastify";
import TfaOnMessage from "./TfaOnMessage";

function EmailSetup({ onClose, setState }) {
  const connectedUser = useSelector((state) => state.authentication);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const sendOtp = async () => {
    const otpResponse = await UserService.send2FACodeOnEmail(
      connectedUser.authToken
    );
    if (!otpResponse.success) {
      toast.warn(
        "Server failed to send a OTP on your registered email addrress!"
      );
      return;
    }
    toast.success("OTP send successfully!");
  };

  const verifiedOtp = async () => {
    const otpResponse = await UserService.verified2FACodeUsingEmail(
      otp,
      connectedUser.authToken
    );
    if (!otpResponse.success) {
      setError(otpResponse.error.message || "Enterd wrong otp!");
      return;
    }
    setSuccess(true);
    onClose();
    setState({
      tfaEnabled: true,
      type: "REGISTERED_EMAIL",
    });
  };

  const fetchUser = async () => {
    const userResponse = await UserService.findUserById(
      connectedUser.id,
      connectedUser.authToken
    );
    if (!userResponse.success) {
      console.error("Failed to fetch the user!");
      return;
    }
    setEmail(userResponse.response.email);
  };

  useEffect(() => {
    if (email.length > 0) {
      sendOtp();
    }

    fetchUser();
  }, [connectedUser, email]);

  if (success) {
    return <TfaOnMessage onClose={onClose} isEmailTfa={true} />;
  }

  return (
    <div className="email-setup-container">
      <div className="email-setup-container-heading">
        <h2>Enter confirmation code</h2>
        <p>
          Enter the 6-digit code we sent to {email.substring(0, 4)}*****
          {email.substring(email.indexOf("@"), email.length)}
        </p>
        <p>It may take up to a minute for you to receive this code.</p>
      </div>
      <div className="email-setup-container-content">
        <input
          type="text"
          placeholder="Enter code"
          value={otp}
          onChange={(event) => setOtp(event.target.value)}
        />
        <span style={{ color: "red" }}>{error}</span>
        <button className="email-setup-next-btn" onClick={verifiedOtp}>
          Next
        </button>
        <button className="email-setup-resend-code" onClick={sendOtp}>
          Resend code
        </button>
      </div>
    </div>
  );
}

export default EmailSetup;
