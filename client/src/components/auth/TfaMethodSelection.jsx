import { useState } from "react";
import "../../styles/TfaMethodSelection.css";
import authService from "../../service/AuthService";
import { toast } from "react-toastify";
import AuthenticationSetup from "./AuthenticatorSetup";
import { useDispatch } from "react-redux";
import { login } from "../../store/authSlice";

const TfaMethodSelection = ({ data }) => {
  const [selectedMethod, setSelectedMethod] = useState("AUTHENTICATOR_APP");
  const [isShowAuthenticationSetup, setIsShowAuthenticationSetup] =
    useState(false);
  const [authenticationResponse, setAuthenticationResponse] = useState({});
  const [userId, setUserId] = useState("");
  const dispatch = useDispatch();

  const selectTfaMethod = async () => {
    const tfaResponse = await authService.enableTfa(data.email, selectedMethod);
    if (!tfaResponse.success) {
      toast.error("Failed to enable tfa option");
      return;
    }
    if (selectedMethod === "AUTHENTICATOR_APP") {
      console.log(tfaResponse);
      setUserId(tfaResponse.response.id);
      setAuthenticationResponse(tfaResponse.response);
      setIsShowAuthenticationSetup(true);
    }
  };

  const skipTfa = async (event) => {
    event.preventDefault();
    const tfaResponse = await authService.login({
      email: data.email,
      password: data.password,
    });
    if (!tfaResponse.success) {
      toast.error("Failed to skip, try again!");
      return;
    }
    dispatch(
      login({
        id: tfaResponse.response.id,
        fullName: tfaResponse.response.fullName,
        email: data.email,
        isAuthenticated: true,
        authToken: tfaResponse.response.token,
        avtar:
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKoAAACUCAMAAAA02EJtAAAAMFBMVEXk5ueutLfp6+ymrbCqsLTIzM6xt7rQ09Xc3+DU19nh4+TZ3N3Lz9HFycvBxsi3vL+knNE6AAADvElEQVR4nO2b2RKkIAwABZFT4f//doc5dufSCQQTraUffO5CIIGEYeh0Op1Op9PpdDqdTuf/QXILwPDOGWNc8IcWtiYmNY6jUtdvWpw9oq/0c9JKiWeU0nH2B5OVPoo1Fm65F+wyrpoKJSZ7lJGVk1brpllWm2O42rTpeSN6bs3LkBqAaJ4Fgd10BplmDLPqBDYVamadsMv2enplnPlE5VRiyjkHCubpA8ek6opNhWDas3SFauIQletRf4uJQbXm92foQ4GHhNNvRHJVU7hP/WUkH9ZKUUG+smT1oAryzbVmo3pAOltl7fK/QTpb6/bUO4oybQEl/utQLiyHWFR5WAkzgdLk712V8FSYcKoi0qkiTYUmU7UbFxQwLJUqJlTdoApYxUeqT6jWVWVS/cx0HtWFShUXqzJUu9WZVDEZ4F2VxvRUo3oi1YjeV8k2q/OEgBMF1iGcJ11BJ4GCMLVGmiY6VeyBhbAqgDwGjnRTdbC40KrpTLFXFpTXwcAS4Bq015YYU9pbSzljLi2Jq4L1pqSLKlO9tY7kJcHqsgVhpHpQuwkw9AVUngV4mm5qTFkKl3X1QMLo/0JR40JG8TUElJ4HGdsshiJX0jQF5aoIr9W/Ap+vvA1BQ74UAJpyta08EwBHApXYm9eu/LwaVmQXPz+RIW5dYqgYjmKaCWtVN6USV4RaQ9qYxLuuEmk5WgNzRno3J31tClfXxnAd53BE0TveBzNNyzSb4P0B2ms3kM9wy3wnm3kbnDHzdGXOzxiCHY6lLAfr5pj0l1CgtY75IQM/cvDWLPmFxUYmkFdYuqwwxpcXUuaHIO8vLFaFhY5T4LH1U811YCTOBeQQZr31zzcGdxTRkT2+kN58xqUS20sII5Jd8CXWyyF7/4kQlrof/8GY3J7B7JKSYP78O2m/g8HGm6pa2X0SWW+AO2gJY2wfyWTAV9a/oXTzs0zBs5pSmp4S5OpxpAkN+1mRpR+Aa7NWlmVn0zxjm0wCv+vPf9DitYAlMRUNekQgtzxtwFbebctA+gPce7zw4y1tYxDjiiz7F4MoFdCOaXatrBQ3aFIrpnJ/3THsr5Nq8m1kK00lNbWNBk2qda7F2XaDfupKdOkUCFym5bXtfXJ+GGW7AM+aulO0srjW1I2SPjzp0A2qKAqGtUHfNw54ns24/G+Aq/Fy/8PUD8DhtbqFqhkKepvF/v/h/Rj4Xno00B4ntvD/DwVUZd3/b0CvBfj/P/SkjX9L0QBYwDrAqgK2jsplPAAKlgbIAwAS7XQ6SP4AIaQzO0GvG4MAAAAASUVORK5CYII=",
      })
    );
  };

  if (isShowAuthenticationSetup) {
    return (
      <AuthenticationSetup
        data={data}
        qrCodeUrl={authenticationResponse.secreteImageUri}
        setupKey={authenticationResponse.setupCode}
        userId={userId}
      />
    );
  }

  return (
    <div className="tfa-page">
      <header className="tfa-header">
        <h5>{data?.firstname + " " + data?.lastname} • NamasteApp</h5>
        <h2>Help protect your account</h2>
        <p>
          Set up two-factor authentication and we'll send you a notification to
          check it's you if someone logs in from a device we don't recognize.
        </p>
      </header>

      <section className="tfa-options">
        <h4 className="tfa-options-heading">
          Choose how you want to receive your authentication code
        </h4>

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

      <footer className="tfa-btns">
        <button className="tfa-skip-btn" onClick={skipTfa}>
          Skip
        </button>
        <button
          className="tfa-continue"
          disabled={!selectedMethod}
          onClick={selectTfaMethod}
        >
          Continue
        </button>
      </footer>
    </div>
  );
};

export default TfaMethodSelection;
