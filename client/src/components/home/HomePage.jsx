import { faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import "../../styles/HomePage.css";

// Mock data
const content = {
  imageUrl: "https://static.whatsapp.net/rsrc.php/v4/y6/r/wa669aeJeom.png",
  headline: "Download NamasteApp for Windows",
  description:
    "Make calls, share your screen and get a faster experience when you download the Windows app.",
  downloadText: "Download",
  securityMessage: "Your personal messages are end-to-end encrypted",
};

function HomePage() {
  return (
    <div className="download-promo">
      <div className="download-promo__content">
        <img
          src={content.imageUrl}
          alt="App preview"
          className="download-promo__image"
        />
        <div className="download-promo__text">
          <h1 className="download-promo__heading">{content.headline}</h1>
          <p className="download-promo__description">{content.description}</p>
        </div>
        <button className="download-promo__button">
          {content.downloadText}
        </button>
        <p className="download-promo__security">
          <FontAwesomeIcon
            icon={faLock}
            className="download-promo__lock-icon"
          />
          <span>{content.securityMessage}</span>
        </p>
      </div>
    </div>
  );
}

export default HomePage;
