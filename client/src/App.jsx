import ChatPreviews from "./components/chats/ChatPreviews";
import ChatWindow from "./components/chats/ChatWindow";
import LeftBar from "./components/leftBar/LeftBar";
import ContactInfo from "./components/profile/ContactInfo";
import HomePage from "./components/home/HomePage";
import "./App.css";
import StatusPreviews from "./components/status/StatusPreviews";

function App() {
  return (
    <div className="app">
      <div className="left-bar-section">
        <LeftBar />
      </div>

      <div className="chat-previews-section">
        <ChatPreviews />
        {/* <StatusPreviews /> */}
      </div>

      <div className="chat-window-section">
        <ChatWindow />
        {/* <HomePage /> */}
      </div>

      {/* <div className="contact-info-page">
        <ContactInfo />
      </div> */}
    </div>
  );
}

export default App;
