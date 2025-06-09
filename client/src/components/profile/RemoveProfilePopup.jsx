import React from "react";
import "../../styles/RemoveProfilePopup.css";
import { useDispatch, useSelector } from "react-redux";
import UserService from "../../service/UserService";
import { toast } from "react-toastify";
import { login, logout } from "../../store/authSlice";

function RemoveProfilePopup({ close, removeProfileRef }) {
  const connectedUser = useSelector((state) => state.authentication);
  const dispatch = useDispatch();

  const removeAvtar = async () => {
    const avtarResponse = await UserService.removeAvtar(
      connectedUser.authToken
    );
    if (!avtarResponse.success) {
        console.error(avtarResponse.error);
      toast.error("Failed to remove the avtar");
      if (avtarResponse.status === 403 || avtarResponse.status === 401) {
        dispatch(logout());
      }
      return;
    }
    dispatch(
      login({
        id: connectedUser.id,
        fullName: connectedUser.fullName,
        email: connectedUser.email,
        isAuthenticated: connectedUser.isAuthenticated,
        authToken: connectedUser.authToken,
        avtar:
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKoAAACUCAMAAAA02EJtAAAAMFBMVEXk5ueutLfp6+ymrbCqsLTIzM6xt7rQ09Xc3+DU19nh4+TZ3N3Lz9HFycvBxsi3vL+knNE6AAADvElEQVR4nO2b2RKkIAwABZFT4f//doc5dufSCQQTraUffO5CIIGEYeh0Op1Op9PpdDqdTuf/QXILwPDOGWNc8IcWtiYmNY6jUtdvWpw9oq/0c9JKiWeU0nH2B5OVPoo1Fm65F+wyrpoKJSZ7lJGVk1brpllWm2O42rTpeSN6bs3LkBqAaJ4Fgd10BplmDLPqBDYVamadsMv2enplnPlE5VRiyjkHCubpA8ek6opNhWDas3SFauIQletRf4uJQbXm92foQ4GHhNNvRHJVU7hP/WUkH9ZKUUG+smT1oAryzbVmo3pAOltl7fK/QTpb6/bUO4oybQEl/utQLiyHWFR5WAkzgdLk712V8FSYcKoi0qkiTYUmU7UbFxQwLJUqJlTdoApYxUeqT6jWVWVS/cx0HtWFShUXqzJUu9WZVDEZ4F2VxvRUo3oi1YjeV8k2q/OEgBMF1iGcJ11BJ4GCMLVGmiY6VeyBhbAqgDwGjnRTdbC40KrpTLFXFpTXwcAS4Bq015YYU9pbSzljLi2Jq4L1pqSLKlO9tY7kJcHqsgVhpHpQuwkw9AVUngV4mm5qTFkKl3X1QMLo/0JR40JG8TUElJ4HGdsshiJX0jQF5aoIr9W/Ap+vvA1BQ74UAJpyta08EwBHApXYm9eu/LwaVmQXPz+RIW5dYqgYjmKaCWtVN6USV4RaQ9qYxLuuEmk5WgNzRno3J31tClfXxnAd53BE0TveBzNNyzSb4P0B2ms3kM9wy3wnm3kbnDHzdGXOzxiCHY6lLAfr5pj0l1CgtY75IQM/cvDWLPmFxUYmkFdYuqwwxpcXUuaHIO8vLFaFhY5T4LH1U811YCTOBeQQZr31zzcGdxTRkT2+kN58xqUS20sII5Jd8CXWyyF7/4kQlrof/8GY3J7B7JKSYP78O2m/g8HGm6pa2X0SWW+AO2gJY2wfyWTAV9a/oXTzs0zBs5pSmp4S5OpxpAkN+1mRpR+Aa7NWlmVn0zxjm0wCv+vPf9DitYAlMRUNekQgtzxtwFbebctA+gPce7zw4y1tYxDjiiz7F4MoFdCOaXatrBQ3aFIrpnJ/3THsr5Nq8m1kK00lNbWNBk2qda7F2XaDfupKdOkUCFym5bXtfXJ+GGW7AM+aulO0srjW1I2SPjzp0A2qKAqGtUHfNw54ns24/G+Aq/Fy/8PUD8DhtbqFqhkKepvF/v/h/Rj4Xno00B4ntvD/DwVUZd3/b0CvBfj/P/SkjX9L0QBYwDrAqgK2jsplPAAKlgbIAwAS7XQ6SP4AIaQzO0GvG4MAAAAASUVORK5CYII=",
      })
    );
    close();
  };
  return (
    <div className="delete-popup-overlay">
      <div className="delete-popup" ref={removeProfileRef}>
        <span className="msg">Remove your profile photo?</span>
        <div className="delete-actions">
          <button className="btn-cancel" onClick={() => close()}>
            Cancel
          </button>
          <button className="btn-remove" onClick={removeAvtar}>
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

export default RemoveProfilePopup;
