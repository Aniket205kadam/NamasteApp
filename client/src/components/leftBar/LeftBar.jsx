import { faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import "../../styles/LeftBar.css";
import { useSelector } from "react-redux";
import chatService from "../../service/ChatService";
import { toast } from "react-toastify";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

function LeftBar({
  openProfile,
  openChatPreviews,
  openStatusPreviews,
  clickedLocation,
}) {
  const connectedUser = useSelector((state) => state.authentication);
  const [notification, setNotification] = useState(0);
  const stompClient = useRef(null);

  const fetchAllNotificationCount = async () => {
    const notificationResponse = await chatService.getAllNotifications(
      connectedUser.authToken
    );
    if (!notificationResponse.success) {
      console.error("Failed to fetch the total count of notification");
      return;
    }
    setNotification(parseInt(notificationResponse.response));
  };

  useEffect(() => {
    fetchAllNotificationCount();
  }, []);

  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws");
    stompClient.current = Stomp.over(socket);

    stompClient.current.connect(
      {},
      () => {
        stompClient.current.subscribe(
          `/users/${connectedUser.id}/chat`,
          (messages) => {
            const notification = JSON.parse(messages.body);
            if (
              notification.receiverId === connectedUser.id &&
              notification.message.state === "SENT" &&
              notification.type === "MESSAGE"
            ) {
              setNotification((prev) => prev + 1);
            }
            if (
              notification.senderId === connectedUser.id &&
              notification.type === "SEEN"
            ) {
              setNotification(0);
            }
          }
        );
      },
      (error) => {
        toast.error("Failed to connect to the server!");
        console.log("Websocker error:", error);
      }
    );
    return () => {
      if (stompClient.current?.connected) {
        stompClient.current.disconnect();
      }
    };
  }, []);

  return (
    <div className="left-bar">
      <div className="container">
        <div className="menu">
          <div className="upper">
            <div
              className={`item ${clickedLocation === "CHATS" ? "clicked" : ""}`}
              onClick={openChatPreviews}
            >
              <svg
                viewBox="0 0 24 24"
                height="24"
                width="24"
                preserveAspectRatio="xMidYMid meet"
                fill="none"
              >
                <title>Chats</title>
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M4.8384 8.45501L5 8.70356V9V17.8333C5 18.7538 5.7462 19.5 6.6667 19.5H20.3333C21.2538 19.5 22 18.7538 22 17.8333V6.66667C22 5.74619 21.2538 5 20.3333 5H2.5927L4.8384 8.45501ZM8 14.5C8 13.6716 8.67157 13 9.5 13H14.5C15.3284 13 16 13.6716 16 14.5C16 15.3284 15.3284 16 14.5 16H9.5C8.67157 16 8 15.3284 8 14.5ZM9.5 8C8.67157 8 8 8.67157 8 9.5C8 10.3284 8.67157 11 9.5 11H16.5C17.3284 11 18 10.3284 18 9.5C18 8.67157 17.3284 8 16.5 8H9.5Z"
                  fill="currentColor"
                ></path>
                <path
                  d="M5 8.70356L5.41919 8.43101L5.5 8.55531V8.70356H5ZM4.8384 8.45501L4.41921 8.72756L4.41917 8.7275L4.8384 8.45501ZM2.5927 5L2.17347 5.27249L1.67137 4.5H2.5927V5ZM4.58081 8.9761L4.41921 8.72756L5.25759 8.18247L5.41919 8.43101L4.58081 8.9761ZM4.5 9V8.70356H5.5V9H4.5ZM4.5 17.8333V9H5.5V17.8333H4.5ZM6.6667 20C5.47006 20 4.5 19.0299 4.5 17.8333H5.5C5.5 18.4777 6.02234 19 6.6667 19V20ZM20.3333 20H6.6667V19H20.3333V20ZM22.5 17.8333C22.5 19.0299 21.53 20 20.3333 20V19C20.9777 19 21.5 18.4777 21.5 17.8333H22.5ZM22.5 6.66667V17.8333H21.5V6.66667H22.5ZM20.3333 4.5C21.53 4.5 22.5 5.47005 22.5 6.66667H21.5C21.5 6.02233 20.9777 5.5 20.3333 5.5V4.5ZM2.5927 4.5H20.3333V5.5H2.5927V4.5ZM4.41917 8.7275L2.17347 5.27249L3.01192 4.72751L5.25762 8.18252L4.41917 8.7275ZM9.5 13.5C8.94772 13.5 8.5 13.9477 8.5 14.5H7.5C7.5 13.3954 8.39543 12.5 9.5 12.5V13.5ZM14.5 13.5H9.5V12.5H14.5V13.5ZM15.5 14.5C15.5 13.9477 15.0523 13.5 14.5 13.5V12.5C15.6046 12.5 16.5 13.3954 16.5 14.5H15.5ZM14.5 15.5C15.0523 15.5 15.5 15.0523 15.5 14.5H16.5C16.5 15.6046 15.6046 16.5 14.5 16.5V15.5ZM9.5 15.5H14.5V16.5H9.5V15.5ZM8.5 14.5C8.5 15.0523 8.94772 15.5 9.5 15.5V16.5C8.39543 16.5 7.5 15.6046 7.5 14.5H8.5ZM7.5 9.5C7.5 8.39543 8.39543 7.5 9.5 7.5V8.5C8.94772 8.5 8.5 8.94772 8.5 9.5H7.5ZM9.5 11.5C8.39543 11.5 7.5 10.6046 7.5 9.5H8.5C8.5 10.0523 8.94772 10.5 9.5 10.5V11.5ZM16.5 11.5H9.5V10.5H16.5V11.5ZM18.5 9.5C18.5 10.6046 17.6046 11.5 16.5 11.5V10.5C17.0523 10.5 17.5 10.0523 17.5 9.5H18.5ZM16.5 7.5C17.6046 7.5 18.5 8.39543 18.5 9.5H17.5C17.5 8.94772 17.0523 8.5 16.5 8.5V7.5ZM9.5 7.5H16.5V8.5H9.5V7.5Z"
                  fill="currentColor"
                ></path>
              </svg>
              {notification > 0 && (
                <div className="message-notification">
                  <span>{notification}</span>
                </div>
              )}
            </div>
            <div
              className={`item ${
                clickedLocation === "STATUS" ? "clicked" : ""
              }`}
              onClick={openStatusPreviews}
            >
              <svg
                viewBox="0 0 24 24"
                height="24"
                width="24"
                preserveAspectRatio="xMidYMid meet"
                fill="none"
              >
                <title>Status</title>
                <path
                  d="M13.5627 3.13663C13.6586 2.59273 14.1793 2.22466 14.7109 2.37438C15.7904 2.67842 16.8134 3.16256 17.7359 3.80858C18.9322 4.64624 19.9304 5.73574 20.6605 7.0005C21.3906 8.26526 21.8348 9.67457 21.9619 11.1294C22.06 12.2513 21.9676 13.3794 21.691 14.4662C21.5548 15.0014 20.9756 15.2682 20.4567 15.0793C19.9377 14.8903 19.6769 14.317 19.7996 13.7785C19.9842 12.9693 20.0421 12.1343 19.9695 11.3035C19.8678 10.1396 19.5124 9.01218 18.9284 8.00038C18.3443 6.98857 17.5457 6.11697 16.5887 5.44684C15.9055 4.96844 15.1535 4.601 14.3605 4.3561C13.8328 4.19314 13.4668 3.68052 13.5627 3.13663Z"
                  fill="currentColor"
                >
                  <path
                    d="M18.8943 17.785C19.3174 18.14 19.3758 18.7749 18.9803 19.1604C18.1773 19.9433 17.2465 20.5872 16.2257 21.0631C14.9022 21.6802 13.4595 22 11.9992 21.9999C10.5388 21.9998 9.09621 21.6798 7.77275 21.0625C6.75208 20.5865 5.82137 19.9424 5.01843 19.1595C4.62302 18.7739 4.68155 18.139 5.10467 17.784C5.52779 17.4291 6.15471 17.4898 6.55964 17.8654C7.16816 18.4298 7.86233 18.8974 8.61817 19.25C9.67695 19.7438 10.831 19.9998 11.9993 19.9999C13.1676 20 14.3217 19.7442 15.3806 19.2505C16.1365 18.898 16.8307 18.4304 17.4393 17.8661C17.8443 17.4906 18.4712 17.43 18.8943 17.785Z"
                    fill="currentColor"
                  ></path>
                </path>
                <path
                  d="M3.54265 15.0781C3.02367 15.267 2.44458 15.0001 2.30844 14.4649C2.03202 13.3781 1.93978 12.2502 2.03794 11.1283C2.16521 9.67361 2.60953 8.26444 3.33966 6.99984C4.06979 5.73523 5.06802 4.64587 6.2642 3.80832C7.18668 3.1624 8.20962 2.67833 9.28902 2.37434C9.82063 2.22462 10.3413 2.59271 10.4372 3.1366C10.5331 3.6805 10.1671 4.19311 9.63938 4.35607C8.84645 4.60094 8.09446 4.96831 7.41133 5.44663C6.45439 6.11667 5.65581 6.98816 5.0717 7.99985C4.4876 9.01153 4.13214 10.1389 4.03032 11.3026C3.95764 12.1334 4.01547 12.9683 4.19986 13.7775C4.32257 14.3159 4.06162 14.8892 3.54265 15.0781Z"
                  fill="currentColor"
                ></path>
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M11.9999 16C14.2091 16 15.9999 14.2092 15.9999 12C15.9999 9.79088 14.2091 8.00002 11.9999 8.00002C9.7908 8.00002 7.99994 9.79088 7.99994 12C7.99994 14.2092 9.7908 16 11.9999 16ZM11.9999 18C15.3136 18 17.9999 15.3137 17.9999 12C17.9999 8.68631 15.3136 6.00002 11.9999 6.00002C8.68623 6.00002 5.99994 8.68631 5.99994 12C5.99994 15.3137 8.68623 18 11.9999 18Z"
                  fill="currentColor"
                ></path>
                <path
                  d="M18.8943 17.785C19.3174 18.14 19.3758 18.7749 18.9803 19.1604C18.1773 19.9433 17.2465 20.5872 16.2257 21.0631C14.9022 21.6802 13.4595 22 11.9992 21.9999C10.5388 21.9998 9.09621 21.6798 7.77275 21.0625C6.75208 20.5865 5.82137 19.9424 5.01843 19.1595C4.62302 18.7739 4.68155 18.139 5.10467 17.784C5.52779 17.4291 6.15471 17.4898 6.55964 17.8654C7.16816 18.4298 7.86233 18.8974 8.61817 19.25C9.67695 19.7438 10.831 19.9998 11.9993 19.9999C13.1676 20 14.3217 19.7442 15.3806 19.2505C16.1365 18.898 16.8307 18.4304 17.4393 17.8661C17.8443 17.4906 18.4712 17.43 18.8943 17.785Z"
                  fill="currentColor"
                ></path>
              </svg>
            </div>
            <div
              className="item"
              onClick={() => window.open("https://chat.openai.com", "_blank")}
            >
              <img
                src="https://static.whatsapp.net/rsrc.php/v4/ye/r/W2MDyeo0zkf.png"
                alt="NamasteAppAI"
                title="Namaste AI"
              />
            </div>
          </div>
          <div className="lower">
            <div
              className={`item ${
                clickedLocation === "SETTINGS" ? "clicked" : ""
              }`}
            >
              <FontAwesomeIcon icon={faGear} />
            </div>
            <div
              className={`connected-user ${
                clickedLocation === "PROFILE" ? "clicked" : ""
              }`}
              style={{ cursor: "pointer" }}
              onClick={openProfile}
            >
              <img
                src={
                  connectedUser.avtar ||
                  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQApAMBIgACEQEDEQH/xAAbAAEAAgMBAQAAAAAAAAAAAAAAAQUCBAYDB//EADAQAQACAgECAggFBQEAAAAAAAABAgMRBAUhMVESEyJBU3GBoRUyQmFyIzSRscEz/8QAFgEBAQEAAAAAAAAAAAAAAAAAAAEC/8QAFxEBAQEBAAAAAAAAAAAAAAAAAAERIf/aAAwDAQACEQMRAD8A+iANMgAAAAAAAAAAAAAAAAAAAAAAAAAAAA3eJ07LyNWt7FP38ZWVOlcav5qzbz3JqqAdDPTeL7sevlLVz9HjvbBef42NMVAzyY7Y7zS8TFo82AgAAAAAAAAAAAAAA3ulcX1+X1l49inu85aLo+m4oxcSka7zG5KsbMRqEgyoADT6lxI5GGZiP6le8S575usmHOdQxeq5mSIjUTO4+rURrAKgAgAAAAAAAAAAOqxRrHWI8ocr73U8e3p4aWj31hKr0ARQABR9biI5VZjxmi8UPWrRbmREfpr3WDQAVAAQAAAAAAAAAAXnRs/rMHqrT7VP9KN68fPbj5YyU93jHmVXUDx43Ix8ikWxz9PfD2ZUBEzGvEEZLRSk2tOoiNy5jkZZzZ75J98/Zv8AVOd6zeHFO6/qnzVixABUAAAAAAAAAAABQeuLjZs3/nSZjzbVekcifzTWPnJo1MOXJht6WO0xKwxdYvWP6uOLfvXsx/Bs3xKfc/B83xKfc4j1t1mNezhn6y0uTz8/I3E29GnlVsfg+b4tPufg+b4lPucFaLGej5ojtek/5eOXp3Jx9/Q3H7SaNQTMTWdTGp8kCgCoAIAAAAAJiJtMRWNzMipx0tkvFKVmbSuuF0ymKItm9q/l7oevT+JHGx7nvkt4z/xuJqoiNRqPBIIAAAjaQAAeHI4uHPGslY35x4qPm8K/Fnc98c+FnRsclK3rNbRuJ7TBo5QbPP4s8XNrxpb8stZpAAQAAAAWHR8Hp5py28KeHzV6+6VSKcSs6727yVW7s2x2bRWWzbHZsGW07hhsiQZG2OzYMtjHZsGWzbHZtB4dQwRyONaP1R3q53Wvm6nbnOXT0OTlrEdotOliPEBUAAAAHQ8P+1xfxc8vuHbfFx68hWxs2jZtBOzaNncE7No2bBltG0bNgnZtjtOwTs2x2bBltSdT/vL/AEXO1L1G3pcu+gaoCoAAAKC16VaZwWiZ7RbskFbiYBAABAAAAJQAJEAE+E/JQZbTbJaZ8ZkAYAKgAg//2Q=="
                }
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeftBar;
