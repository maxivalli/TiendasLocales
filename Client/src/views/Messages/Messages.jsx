import { React, useEffect } from "react";
import { useSelector } from "react-redux";
import { ChatEngine } from "react-chat-engine";
import "./Messages.css";

const Messages = () => {

  useEffect(() => {
    
    const updateDOMElements = () => {
      let people = document.querySelector(
        "#root > div.chat > div > div.ce-wrapper > div.ce-settings-column > div > div > div:nth-child(2) > div > div.ce-section-title-container.ce-person-title-container > div"
      );

      if (people) {
        people.textContent = "Usuarios";
      }

      let photos = document.querySelector(
        "#root > div.chat > div > div.ce-wrapper > div.ce-settings-column > div > div > div.ce-photo-section > div > div.ce-section-title-container.ce-photo-title-container > div"
      );

      if (photos) {
        photos.textContent = "Fotos";
      }

      let options = document.querySelector("#ce-options-drop-down > div");

      if (options) {
        options.textContent = "Opciones";
      }
    };

    const timeout = setTimeout(() => {
      updateDOMElements();
    }, 1500);

    return () => clearTimeout(timeout);
  }, []);

  const userData = useSelector((state) => state.userData);

  return (
    <>
      <div className="chat">
        <ChatEngine
          projectID="1fb49778-0ca9-4761-a91b-512f3a51ee7f"
          userName={userData.username}
          userSecret={userData.email}
          height="calc(100vh - 60px)"
          offset={-3}
        />
      </div>
    </>
  );
};

export default Messages;


/* import React from 'react'

const Messages = () => {
  return (
    <div>Messages</div>
  )
}

export default Messages */