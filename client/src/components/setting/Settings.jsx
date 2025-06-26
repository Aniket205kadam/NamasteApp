import {
  faArrowRightFromBracket,
  faBell,
  faLock,
  faMagnifyingGlass,
  faMessage,
  faShield,
  faUser,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import userService from "../../service/UserService";
import "../../styles/Settings.css";
import { logout } from "../../store/authSlice";

function Settings({ openPasswordAndSecurity }) {
  const [search, setSearch] = useState("");
  const [user, setUser] = useState({});
  const connectedUser = useSelector((state) => state.authentication);
  const dispatch = useDispatch();

  const fetchUser = async () => {
    const userResponse = await userService.findUserById(
      connectedUser.id,
      connectedUser.authToken
    );
    if (!userResponse.success) {
      console.error("Failed to fetch the user!");
      if (userResponse.status === 403 || userResponse.status === 401) {
        dispatch(logout());
      }
      return;
    }
    setUser(userResponse.response);
  };

  const handleLogout = () => {
    dispatch(logout());
  }

  useEffect(() => {
    fetchUser();
  }, []);

  const clearSearch = () => {
    setSearch("");
  };

  return (
    <div className="setting-page">
      <div className="setting-heading">
        <span>Settings</span>
      </div>
      <div className="search-setting">
        <div className="setting-input">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="search-icon" />
          <input
            type="text"
            placeholder="Search settings"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          {search.length > 0 && (
            <div className="remove-setting-search" onClick={clearSearch}>
              <FontAwesomeIcon icon={faXmark} />
            </div>
          )}
        </div>
      </div>
      <div className="setting-connected-user">
        <div className="setting-user-profile">
          <img src={connectedUser.avtar} alt={connectedUser.fullName} />
        </div>
        <div className="setting-user-info">
          <span className="username">{user.firstname + " " + user.lastname}</span>
          <span className="about">
            {user?.about || "Hey there! I am using WhatsApp"}
          </span>
        </div>
      </div>
      <div className="setting-options">
        <div className="setting-option">
          <div className="setting-option-icon">
            <FontAwesomeIcon icon={faUser} />
          </div>
          <span className="setting-option-text">Account</span>
        </div>
        <div className="setting-option" onClick={openPasswordAndSecurity}>
          <div className="setting-option-icon">
            <FontAwesomeIcon icon={faShield} />
          </div>
          <span className="setting-option-text">Password and security</span>
        </div>
        <div className="setting-option">
          <div className="setting-option-icon">
            <FontAwesomeIcon icon={faLock} />
          </div>
          <span className="setting-option-text">Privacy</span>
        </div>
        <div className="setting-option">
          <div className="setting-option-icon">
            <FontAwesomeIcon icon={faMessage} />
          </div>
          <span className="setting-option-text">Chats</span>
        </div>
        <div className="setting-option">
          <div className="setting-option-icon">
            <FontAwesomeIcon icon={faBell} />
          </div>
          <span className="setting-option-text">Notifications</span>
        </div>
        
        <div className="setting-option logout" onClick={handleLogout}>
          <div className="setting-option-icon">
            <FontAwesomeIcon icon={faArrowRightFromBracket} />
          </div>
          <span className="setting-option-text">Log out</span>
        </div>
      </div>
    </div>
  );
}

export default Settings;
