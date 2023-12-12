import { React } from "react";
import { useSelector } from "react-redux";
import { ChatEngine } from "react-chat-engine";
import "./Messages.css";

const Messages = () => {
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
