import React, { useState } from "react";
import style from "./NavButtons.module.css";
import { Link } from "react-router-dom";
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
    const projectID = "8592741f-0f29-4f09-bcfc-6669ac97b3a5";
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
      navigate("/mensajes/usuario");
    } catch (error) {
      console.error("Error creating chat:", error.message);
      throw error;
    }
  };

  const handleShareButtonClick = async () => {
    const storeLink = window.location.href;

    try {
      await navigator.clipboard.writeText(storeLink);
      alert("Enlace copiado al portapapeles:", storeLink);
    } catch (error) {
      alert("Error al copiar al portapapeles:", error);
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
          <Link to={store.whatsapp} target="_blank">
            <button>
              <img
                width="40"
                height="40"
                src="https://img.icons8.com/color/48/whatsapp--v1.png"
                alt="whatsapp--v1"
              />
            </button>
          </Link>
          <Link to={store.facebook} target="_blank">
            <button>
              <img
                width="40"
                height="40"
                src="https://img.icons8.com/fluency/48/facebook-new.png"
                alt="facebook-new"
              />
            </button>
          </Link>
          <Link to={store.instagram} target="_blank">
            <button>
              <img
                width="40"
                height="40"
                src="https://img.icons8.com/fluency/48/instagram-new.png"
                alt="instagram-new"
              />
            </button>
          </Link>
          <button className={style.share} onClick={handleShareButtonClick}>
            <img
              width="30"
              height="30"
              src="https://img.icons8.com/material-sharp/48/FFFFFF/share.png"
              alt="share"
            />
          </button>
        </div>
      )}
    </>
  );
};

export default NavButtons;
