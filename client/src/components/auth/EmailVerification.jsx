import { useEffect, useState } from "react";
import "../../styles/EmailVerification.css";
import { toast } from "react-toastify";
import Loading from "../animation/Loading";
import authService from "../../service/AuthService";
import AuthService from "../../service/AuthService";
import { useDispatch } from "react-redux";
import { login } from "../../store/authSlice";

function EmailVerification({ data }) {
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(120);
  const [isExpired, setIsExpired] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isShowTfa, setIsShowTfa] = useState(false);
  const dispatch = useDispatch();

  const sendOtp = async () => {
    setLoading(true);
    const otpResponse = await authService.emailVerification(data.email, otp);
    if (!otpResponse.success) {
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

    const loginResponse = await AuthService.login({
      email: data.email,
      password: data.password,
    });
    if (!loginResponse.success) {
      toast.error("Failed to login, try again!");
      return;
    }

    dispatch(
      login({
        id: loginResponse.response.id,
        fullName: loginResponse.response.fullName,
        email: data.email,
        isAuthenticated: true,
        authToken: loginResponse.response.token,
        avtar:
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKoAAACUCAMAAAA02EJtAAAAMFBMVEXk5ueutLfp6+ymrbCqsLTIzM6xt7rQ09Xc3+DU19nh4+TZ3N3Lz9HFycvBxsi3vL+knNE6AAADvElEQVR4nO2b2RKkIAwABZFT4f//doc5dufSCQQTraUffO5CIIGEYeh0Op1Op9PpdDqdTuf/QXILwPDOGWNc8IcWtiYmNY6jUtdvWpw9oq/0c9JKiWeU0nH2B5OVPoo1Fm65F+wyrpoKJSZ7lJGVk1brpllWm2O42rTpeSN6bs3LkBqAaJ4Fgd10BplmDLPqBDYVamadsMv2enplnPlE5VRiyjkHCubpA8ek6opNhWDas3SFauIQletRf4uJQbXm92foQ4GHhNNvRHJVU7hP/WUkH9ZKUUG+smT1oAryzbVmo3pAOltl7fK/QTpb6/bUO4oybQEl/utQLiyHWFR5WAkzgdLk712V8FSYcKoi0qkiTYUmU7UbFxQwLJUqJlTdoApYxUeqT6jWVWVS/cx0HtWFShUXqzJUu9WZVDEZ4F2VxvRUo3oi1YjeV8k2q/OEgBMF1iGcJ11BJ4GCMLVGmiY6VeyBhbAqgDwGjnRTdbC40KrpTLFXFpTXwcAS4Bq015YYU9pbSzljLi2Jq4L1pqSLKlO9tY7kJcHqsgVhpHpQuwkw9AVUngV4mm5qTFkKl3X1QMLo/0JR40JG8TUElJ4HGdsshiJX0jQF5aoIr9W/Ap+vvA1BQ74UAJpyta08EwBHApXYm9eu/LwaVmQXPz+RIW5dYqgYjmKaCWtVN6USV4RaQ9qYxLuuEmk5WgNzRno3J31tClfXxnAd53BE0TveBzNNyzSb4P0B2ms3kM9wy3wnm3kbnDHzdGXOzxiCHY6lLAfr5pj0l1CgtY75IQM/cvDWLPmFxUYmkFdYuqwwxpcXUuaHIO8vLFaFhY5T4LH1U811YCTOBeQQZr31zzcGdxTRkT2+kN58xqUS20sII5Jd8CXWyyF7/4kQlrof/8GY3J7B7JKSYP78O2m/g8HGm6pa2X0SWW+AO2gJY2wfyWTAV9a/oXTzs0zBs5pSmp4S5OpxpAkN+1mRpR+Aa7NWlmVn0zxjm0wCv+vPf9DitYAlMRUNekQgtzxtwFbebctA+gPce7zw4y1tYxDjiiz7F4MoFdCOaXatrBQ3aFIrpnJ/3THsr5Nq8m1kK00lNbWNBk2qda7F2XaDfupKdOkUCFym5bXtfXJ+GGW7AM+aulO0srjW1I2SPjzp0A2qKAqGtUHfNw54ns24/G+Aq/Fy/8PUD8DhtbqFqhkKepvF/v/h/Rj4Xno00B4ntvD/DwVUZd3/b0CvBfj/P/SkjX9L0QBYwDrAqgK2jsplPAAKlgbIAwAS7XQ6SP4AIaQzO0GvG4MAAAAASUVORK5CYII=",
      })
    );
  };

  const resendOtpHandler = async () => {
    const otpResponse = await authService.resendOtp(email);
    if (!otpResponse.success) {
      toast.error(otpResponse.error.message || "Failed to resend the mail!");
      return;
    }
    toast.success(
      "Successfully send new One-Time Password (OTP) on your register email address!"
    );
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
            <span className="underlined" onClick={resendOtpHandler}>
              Resend email
            </span>
          </p>
        )}
      </form>
    </div>
  );
}

export default EmailVerification;
