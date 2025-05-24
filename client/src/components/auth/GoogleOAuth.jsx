import React from "react";
import { useDispatch } from "react-redux";
import authService from "../../service/AuthService";
import { toast } from "react-toastify";
import { login } from "../../store/authSlice";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import AppConfig from "../../config/AppConfig";

function GoogleOAuth() {
  const googleClientId = AppConfig.googleClientId;
  const dispatch = useDispatch();

  const handleOauthSuccess = async (credentialResponse) => {
    const authResponse = await authService.loginWithGoogle(credentialResponse);
    if (!authResponse.success) {
      toast.error("Failed to login with google!");
      return;
    }
    const json = authResponse.response;
    dispatch(
      login({
        id: json.id,
        fullName: json.fullName,
        email: json.email,
        isAuthenticated: json.isAuthenticated,
        authToken: json.authToken,
        avtar:
          json.avtar ||
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKoAAACUCAMAAAA02EJtAAAAMFBMVEXk5ueutLfp6+ymrbCqsLTIzM6xt7rQ09Xc3+DU19nh4+TZ3N3Lz9HFycvBxsi3vL+knNE6AAADvElEQVR4nO2b2RKkIAwABZFT4f//doc5dufSCQQTraUffO5CIIGEYeh0Op1Op9PpdDqdTuf/QXILwPDOGWNc8IcWtiYmNY6jUtdvWpw9oq/0c9JKiWeU0nH2B5OVPoo1Fm65F+wyrpoKJSZ7lJGVk1brpllWm2O42rTpeSN6bs3LkBqAaJ4Fgd10BplmDLPqBDYVamadsMv2enplnPlE5VRiyjkHCubpA8ek6opNhWDas3SFauIQletRf4uJQbXm92foQ4GHhNNvRHJVU7hP/WUkH9ZKUUG+smT1oAryzbVmo3pAOltl7fK/QTpb6/bUO4oybQEl/utQLiyHWFR5WAkzgdLk712V8FSYcKoi0qkiTYUmU7UbFxQwLJUqJlTdoApYxUeqT6jWVWVS/cx0HtWFShUXqzJUu9WZVDEZ4F2VxvRUo3oi1YjeV8k2q/OEgBMF1iGcJ11BJ4GCMLVGmiY6VeyBhbAqgDwGjnRTdbC40KrpTLFXFpTXwcAS4Bq015YYU9pbSzljLi2Jq4L1pqSLKlO9tY7kJcHqsgVhpHpQuwkw9AVUngV4mm5qTFkKl3X1QMLo/0JR40JG8TUElJ4HGdsshiJX0jQF5aoIr9W/Ap+vvA1BQ74UAJpyta08EwBHApXYm9eu/LwaVmQXPz+RIW5dYqgYjmKaCWtVN6USV4RaQ9qYxLuuEmk5WgNzRno3J31tClfXxnAd53BE0TveBzNNyzSb4P0B2ms3kM9wy3wnm3kbnDHzdGXOzxiCHY6lLAfr5pj0l1CgtY75IQM/cvDWLPmFxUYmkFdYuqwwxpcXUuaHIO8vLFaFhY5T4LH1U811YCTOBeQQZr31zzcGdxTRkT2+kN58xqUS20sII5Jd8CXWyyF7/4kQlrof/8GY3J7B7JKSYP78O2m/g8HGm6pa2X0SWW+AO2gJY2wfyWTAV9a/oXTzs0zBs5pSmp4S5OpxpAkN+1mRpR+Aa7NWlmVn0zxjm0wCv+vPf9DitYAlMRUNekQgtzxtwFbebctA+gPce7zw4y1tYxDjiiz7F4MoFdCOaXatrBQ3aFIrpnJ/3THsr5Nq8m1kK00lNbWNBk2qda7F2XaDfupKdOkUCFym5bXtfXJ+GGW7AM+aulO0srjW1I2SPjzp0A2qKAqGtUHfNw54ns24/G+Aq/Fy/8PUD8DhtbqFqhkKepvF/v/h/Rj4Xno00B4ntvD/DwVUZd3/b0CvBfj/P/SkjX9L0QBYwDrAqgK2jsplPAAKlgbIAwAS7XQ6SP4AIaQzO0GvG4MAAAAASUVORK5CYII=",
      })
    );
  };

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <div style={{ padding: "20px" }}>
        <GoogleLogin
          onSuccess={handleOauthSuccess}
          onError={() => toast.error("Failed to Login!")}
          type="standard"
          theme="filled_blue"
          shape="rectangular"
          size="large"
          text="continue_with"
          width="400"
          logo_alignment="left"
          className="custom-google-button"
        />
      </div>
    </GoogleOAuthProvider>
  );
}

export default GoogleOAuth;
