import {
    faAngleRight,
    faBan,
    faHeart,
    faPen,
    faTrashCan,
    faUnlink,
    faXmark,
  } from "@fortawesome/free-solid-svg-icons";
  import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
  import React from "react";
  import "../../styles/ContactInfo.css";
  
  // Mock data
  const mockUser = {
    avatar: 'https://images.pexels.com/photos/31203739/pexels-photo-31203739/free-photo-of-black-and-white-outdoor-portrait-of-man.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load',
    name: 'John Doe',
    email: 'john.doe@example.com',
    about: 'Hey there! I am using WhatsApp.',
    status: 'online'
  };
  
  const mockMedia = [
    { src: 'https://images.pexels.com/photos/31203739/pexels-photo-31203739/free-photo-of-black-and-white-outdoor-portrait-of-man.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load', type: 'image' },
    { src: 'https://images.pexels.com/photos/31761351/pexels-photo-31761351/free-photo-of-abstract-perspective-of-stacked-chairs-in-argentina.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load', type: 'image' },
    { src: 'https://example.com/doc.pdf', type: 'document' }
  ];
  
  const mockChat = {
    isFavourite: false,
    isBlocked: false
  };
  
  function ContactInfo() {
    return (
      <div className="contact-info">
        {/* Header */}
        <header className="contact-info__header">
          <button className="contact-info__close-btn">
            <FontAwesomeIcon icon={faXmark} size="lg" />
          </button>
          <h1 className="contact-info__title">Contact info</h1>
          <button className="contact-info__edit-btn">
            <FontAwesomeIcon icon={faPen} />
          </button>
        </header>
  
        {/* Profile Section */}
        <section className="contact-info__profile">
          <div className="contact-info__avatar-wrapper">
            <img 
              src={mockUser.avatar} 
              alt={mockUser.name} 
              className="contact-info__avatar"
            />
            {/* <span className={`contact-info__status ${mockUser.status}`}></span> */}
          </div>
          <h2 className="contact-info__name">{mockUser.name}</h2>
          <p className="contact-info__email">{mockUser.email}</p>
        </section>
  
        {/* About Section */}
        <section className="contact-info__section">
          <h3 className="contact-info__section-title">About</h3>
          <p className="contact-info__about">{mockUser.about}</p>
        </section>
  
        {/* Media Section */}
        <section className="contact-info__section">
          <div className="contact-info__section-header">
            <h3 className="contact-info__section-title">Media, links and docs</h3>
            <button className="contact-info__media-count">
              {mockMedia.length}
              <FontAwesomeIcon icon={faAngleRight} className="ml-2" />
            </button>
          </div>
          <div className="contact-info__media-grid">
            {mockMedia.slice(0,2).map((media, index) => (
              <img 
                key={index}
                src={media.src} 
                alt={`Media ${index + 1}`} 
                className="contact-info__media-thumbnail"
              />
            ))}
          </div>
        </section>
  
        {/* Actions Section */}
        <section className="contact-info__actions">
          <button className="contact-info__action-btn contact-info__action-btn--favourite">
            <FontAwesomeIcon icon={faHeart} />
            {mockChat.isFavourite ? 'Remove from favourites' : 'Add to favourites'}
          </button>
          <button className="contact-info__action-btn">
            <FontAwesomeIcon icon={faBan} />
            {mockChat.isBlocked ? 'Unblock' : 'Block'}
          </button>
          <button className="contact-info__action-btn">
            <FontAwesomeIcon icon={faUnlink} />
            Report
          </button>
          <button className="contact-info__action-btn contact-info__action-btn--delete">
            <FontAwesomeIcon icon={faTrashCan} />
            Delete chat
          </button>
        </section>
      </div>
    );
  }
  
  export default ContactInfo;