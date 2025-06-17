import ChatPreviews from "./components/chats/ChatPreviews";
import ChatWindow from "./components/chats/ChatWindow";
import LeftBar from "./components/leftBar/LeftBar";
import ContactInfo from "./components/profile/ContactInfo";
import HomePage from "./components/home/HomePage";
import "./App.css";
import StatusPreviews from "./components/status/StatusPreviews";
import CreateChat from "./components/chats/CreateChat";
import { useEffect, useState } from "react";
import Search from "./components/search/Search";
import Profile from "./components/profile/Profile";
import Settings from "./components/setting/settings";
import PasswordAndSecurity from "./components/setting/PasswordAndSecurity";

function App() {
  const [isChatPreviews, setIsChatPreviews] = useState(true);
  const [isCreateChatOpen, setIsCreateChatOpen] = useState(false);
  const [isStatusPreviews, setIsStatusPreviews] = useState(false);
  const [currentOpenChatId, setCurrentOpenChatId] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingOpen, setIsSettingOpen] = useState(false);
  const [isPasswordAndSecurity, setIsPasswordAndSecurity] = useState(false);

  const getLocation = () => {
    if (isChatPreviews) {
      return "CHATS";
    } else if (isCreateChatOpen) {
      return "CREATES";
    } else if (isStatusPreviews) {
      return "STATUS";
    } else if (isProfileOpen) {
      return "PROFILE";
    } else {
      return "SETTINGS";
    }
  };

  // close chatWindow when click Esc btn
  useEffect(() => {
    const handleEscBtn = (event) => {
      if (event.key === "Escape") {
        setCurrentOpenChatId("");
      }
    };
    window.addEventListener("keydown", handleEscBtn);

    return () => {
      window.removeEventListener("keydown", handleEscBtn);
    };
  }, []);

  return (
    <div className="app">
      <div className="left-bar-section">
        <LeftBar
          setCurrentOpenChatId={setCurrentOpenChatId}
          openProfile={() => {
            setIsChatPreviews(false);
            setIsSettingOpen(false);
            setIsCreateChatOpen(false);
            setIsStatusPreviews(false);
            setIsProfileOpen(true);
            setIsPasswordAndSecurity(false);
          }}
          openChatPreviews={() => {
            setIsCreateChatOpen(false);
            setIsSettingOpen(false);
            setIsStatusPreviews(false);
            setIsProfileOpen(false);
            setIsChatPreviews(true);
            setIsPasswordAndSecurity(false);
          }}
          openSetting={() => {
            setIsCreateChatOpen(false);
            setIsProfileOpen(false);
            setIsChatPreviews(false);
            setIsStatusPreviews(false);
            setIsSettingOpen(true);
            setIsPasswordAndSecurity(false);
          }}
          openStatusPreviews={() => {
            setIsCreateChatOpen(false);
            setIsSettingOpen(false);
            setIsProfileOpen(false);
            setIsChatPreviews(false);
            setIsStatusPreviews(true);
            setIsPasswordAndSecurity(false);
          }}
          clickedLocation={getLocation()}
        />
      </div>

      <div className="chat-previews-section">
        {isChatPreviews && (
          <ChatPreviews
            openCreateChatPage={() => {
              setIsChatPreviews(false);
              setIsStatusPreviews(false);
              setIsCreateChatOpen(true);
              setIsPasswordAndSecurity(false);
            }}
            setCurrentChat={setCurrentOpenChatId}
          />
        )}
        {isCreateChatOpen && (
          <CreateChat
            closeCreateChatPage={() => {
              setIsChatPreviews(true);
              setIsStatusPreviews(false);
              setIsCreateChatOpen(false);
              setIsPasswordAndSecurity(false);
            }}
            setCurrentChat={setCurrentOpenChatId}
          />
        )}

        {isProfileOpen && <Profile />}

        {isStatusPreviews && <StatusPreviews />}

        {isSettingOpen && <Settings openPasswordAndSecurity={() => {
          setIsProfileOpen(false);
          setIsStatusPreviews(false);
          setIsSettingOpen(false);
          setIsPasswordAndSecurity(true);
        }} />}

        {isPasswordAndSecurity && <PasswordAndSecurity />}
      </div>

      <div className="chat-window-section">
        {currentOpenChatId.length === 0 ? (
          <HomePage />
        ) : (
          <ChatWindow
            chatId={currentOpenChatId}
            openSearch={() => setIsSearchOpen(true)}
            openContactInfo={() => setIsContactOpen(true)}
          />
        )}
      </div>

      {isContactOpen && (
        <div className="contact-info-page">
          <ContactInfo close={() => setIsContactOpen(false)} chatId={currentOpenChatId} />
        </div>
      )}

      {isSearchOpen && (
        <div className="contact-info-page">
          <Search chatId={currentOpenChatId} onClose={() => setIsSearchOpen(false)} />
        </div>
      )}
    </div>
  );
}

export default App;
