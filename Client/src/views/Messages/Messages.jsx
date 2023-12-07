import {React, useState, useEffect } from "react";
import Head from '../../components/Head/Head'
import { useSelector } from 'react-redux';
import { PrettyChatWindow } from "react-chat-engine-pretty";
import "./Messages.css";

const Messages = () => {

  const userData = useSelector((state) => state.userData)

  const [showModal, setShowModal] = useState(false);
  const [chatClass, setChatClass] = useState("chat");

  console.log("token", userData)

  const toggleModal = () => {
    setShowModal((prevState) => !prevState);
    setChatClass(prevClass => prevClass === "chat" ? "chat2" : "chat");
  };

  const buttonLabel =
    chatClass === "chat2" ? (
      <img width="22" height="22" src="https://img.icons8.com/sf-regular-filled/48/FA5252/chat.png" alt="chat"/>
    ) : (
      <img width="22" height="22" src="https://img.icons8.com/material-rounded/24/737373/menu--v1.png" alt="menu--v1"/>
    );


  useEffect(() => {
    
      if (window.innerWidth < 768) {
        setChatClass("chat2");
      } else {
        setChatClass("chat");
      }
    
  }, []);
  
  return (
    <>
      <div className={chatClass}>
      <button onClick={toggleModal} className="toggle">{buttonLabel}</button>
        <PrettyChatWindow
          projectId="1fb49778-0ca9-4761-a91b-512f3a51ee7f"
          username= {userData.username}
          secret= {userData.email}
          height="calc(100vh - 60px)"
          />
      </div>
    </>
  );
};

export default Messages;
