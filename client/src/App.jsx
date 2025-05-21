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

function App() {
  const [isChatPreviews, setIsChatPreviews] = useState(true);
  const [isCreateChatOpen, setIsCreateChatOpen] = useState(false);
  const [isStatusPreviews, setIsStatusPreviews] = useState(false);
  const [currentOpenChatId, setCurrentOpenChatId] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

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
          openProfile={() => {
            setIsChatPreviews(false);
            setIsCreateChatOpen(false);
            setIsStatusPreviews(false);
            setIsProfileOpen(true);
          }}
          openChatPreviews={() => {
            setIsCreateChatOpen(false);
            setIsStatusPreviews(false);
            setIsProfileOpen(false);
            setIsChatPreviews(true);
          }}
          openStatusPreviews={() => {
            setIsCreateChatOpen(false);
            setIsProfileOpen(false);
            setIsChatPreviews(false);
            setIsStatusPreviews(true);
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
            }}
            setCurrentChat={setCurrentOpenChatId}
          />
        )}

        {isProfileOpen && <Profile />}

        {isStatusPreviews && <StatusPreviews />}
      </div>

      {/* <div className="chat-previews-section">
        <Profile />
      </div> */}

      <div className="chat-window-section">
        {currentOpenChatId.length === 0 ? (
          <HomePage />
        ) : (
          <ChatWindow
            chatId={currentOpenChatId}
            openSearch={() => setIsSearchOpen(true)}
          />
        )}
      </div>

      {isContactOpen && (
        <div className="contact-info-page">
          <ContactInfo />
        </div>
      )}

      {isSearchOpen && (
        <div className="contact-info-page">
          <Search chatId={currentOpenChatId} />
        </div>
      )}
    </div>
  );
}

export default App;
