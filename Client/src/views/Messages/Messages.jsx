import React from "react";
import { PrettyChatWindow } from "react-chat-engine-pretty";
import "./Messages.css";

const Messages = () => {
  return (
    <>
      <div className="chat">
        <PrettyChatWindow
          projectId="1fb49778-0ca9-4761-a91b-512f3a51ee7f"
          username="maxivalli"
          secret="Maxi1368"
          height="92vh"
        />
      </div>
    </>
  );
};

export default Messages;
