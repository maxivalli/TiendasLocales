import React from "react";
import { useSelector } from 'react-redux';
import { PrettyChatWindow } from "react-chat-engine-pretty";
import "./Messages.css";

const Messages = () => {
  const userData = useSelector((state) => state.userData)

  return (
    <>
      <div className="chat">
        <PrettyChatWindow
          projectId="1fb49778-0ca9-4761-a91b-512f3a51ee7f"
          username= {userData.username}
          secret= {userData.token}
          height="92vh"
        />
      </div>
    </>
  );
};

export default Messages;
