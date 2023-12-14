import React, { useState } from "react";
import style from "./NavButtons.module.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const NavButtons = ({ storeId }) => {
  const navigate = useNavigate();
  const userData = useSelector((state) => state.userData);
  const stores = useSelector((state) => state.allStores);
  const [mostrarBotonesExtras, setMostrarBotonesExtras] = useState(false);
  const store = stores.find((store) => store.id == storeId);

  const handleNavButtonClick = () => {
    setMostrarBotonesExtras(!mostrarBotonesExtras);
  };

  const handleChatButtonClick = async () => {
    const projectID = "1fb49778-0ca9-4761-a91b-512f3a51ee7f";
    const userName = userData.username;
    const userSecret = userData.email;

    const apiUrl = "https://api.chatengine.io/chats/";

    const usernames = [store.nombre];
    const title = "Nuevo chat";
    const isDirectChat = true;

    try {
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Project-ID": projectID,
          "User-Name": userName,
          "User-Secret": userSecret,
        },
        body: JSON.stringify({
          usernames,
          title,
          is_direct_chat: isDirectChat,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create chat");
      }

      console.log("Chat created successfully");
      navigate("/messages");
    } catch (error) {
      console.error("Error creating chat:", error.message);
      throw error;
    }
  };

  return (
    <>
      <button className={style.chat} onClick={handleChatButtonClick}>
        <img
          width="30"
          height="30"
          src="https://img.icons8.com/sf-regular/48/FFFFFF/chat.png"
          alt="chat"
        />
      </button>
      <button className={style.nav} onClick={handleNavButtonClick}>
        <img
          width="24"
          height="24"
          src="https://img.icons8.com/ios-filled/50/FFFFFF/add-user-male.png"
          alt="add-user-male"
        />
      </button>
      {mostrarBotonesExtras && (
        <div className={style.botonesExtras}>
          <button>
            <img
              width="40"
              height="40"
              src="https://img.icons8.com/color/48/whatsapp--v1.png"
              alt="whatsapp--v1"
            />
          </button>
          <button>
            <img
              width="40"
              height="40"
              src="https://img.icons8.com/fluency/48/facebook-new.png"
              alt="facebook-new"
            />
          </button>
          <button>
            <img
              width="40"
              height="40"
              src="https://img.icons8.com/fluency/48/instagram-new.png"
              alt="instagram-new"
            />
          </button>
        </div>
      )}
    </>
  );
};

export default NavButtons;
