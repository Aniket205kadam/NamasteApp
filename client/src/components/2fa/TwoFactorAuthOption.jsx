import { useEffect, useState } from "react";
import "../../styles/TwoFactorAuthOption.css";
import { useSelector } from "react-redux";
import UserService from "../../service/UserService";
import { toast } from "react-toastify";

const TwoFactorAuthOption = ({ response, onClose, state }) => {
  const isApp = response.type === "AUTHENTICATOR_APP";
  const [isTfaOn, setIsTfaOn] = useState(response.tfaEnabled);
  const [isShowTurnOff, setIsShowTurnOff] = useState(false);

  useEffect(() => {
    if (!isTfaOn) {
      setIsShowTurnOff(true);
    }
  }, [isTfaOn]);

  return (
    <div className="two-factor-option">
      {isShowTurnOff && (
        <TwoFactorAuthTurnOff onClose={onClose} state={state} />
      )}
      <div
        className={`two-factor-option__heading ${
          isApp ? "two-factor-option--app" : "two-factor-option--email"
        }`}
      >
        <div className="two-factor-option__title">
          {isApp ? "Authentication App" : "Registered Email"}
        </div>
        <span className="two-factor-option__description">
          {isApp
            ? "You'll get a login code from your authentication app."
            : "You'll get a login code from your registered email address."}
        </span>
        <input
          type="checkbox"
          className="two-factor-option__radio"
          checked={isTfaOn}
          onChange={() => setIsTfaOn((prev) => !prev)}
        />
      </div>
    </div>
  );
};

const TwoFactorAuthTurnOff = ({ onClose, state }) => {
  const connectedUser = useSelector((state) => state.authentication);

  const turnOff = async () => {
    const tfaResponse = await UserService.turnOff2FA(connectedUser.authToken);
    if (!tfaResponse.success) {
      console.error("Failed to turn off the two-factor authentication");
      return;
    }
    toast.warn("Turn off two-factor authentication for your account!");
    state({
      tfaEnabled: false,
      type: null,
    });
    onClose();
  };
  return (
    <div className="two-factor-turn-off">
      <div className="two-factor-turn-off__content">
        <div className="two-factor-turn-off__icon">⚠️</div>
        <div className="two-factor-turn-off__heading">
          Turn off two-factor authentication?
        </div>
        <p className="two-factor-turn-off__description">
          Your account will no longer have an extra layer of protection. We
          recommend keeping this security feature enabled.
        </p>
      </div>
      <div className="two-factor-turn-off__actions">
        <button className="two-factor-turn-off__button two-factor-turn-off__button--cancel">
          Cancel
        </button>
        <button
          className="two-factor-turn-off__button two-factor-turn-off__button--confirm"
          onClick={turnOff}
        >
          Turn Off
        </button>
      </div>
    </div>
  );
};

export default TwoFactorAuthOption;
