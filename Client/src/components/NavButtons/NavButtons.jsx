import React, { useState } from "react";
import style from "./NavButtons.module.css";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import chat from '../../assets/chat.png'
import social from '../../assets/social.png'
import face from '../../assets/face.png'
import whats from '../../assets/whats.png'
import insta from '../../assets/insta.png'
import share from '../../assets/share.png'

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
    const projectID = "236f9c42-06cc-414f-98cd-b7465ea5c29e";
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
          src={chat}
          alt="chat"
        />
      </button>
      <button className={style.nav} onClick={handleNavButtonClick}>
        <img
          width="30"
          height="30"
          src={social}
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
                src={whats}
                alt="whatsapp--v1"
              />
            </button>
          </Link>
          <Link to={store.facebook} target="_blank">
            <button>
              <img
                width="40"
                height="40"
                src={face}
                alt="facebook-new"
              />
            </button>
          </Link>
          <Link to={store.instagram} target="_blank">
            <button>
              <img
                width="40"
                height="40"
                src={insta}
                alt="instagram-new"
              />
            </button>
          </Link>
          <button className={style.share} onClick={handleShareButtonClick}>
            <img
              width="24"
              height="24"
              src={share}
              alt="share"
            />
          </button>
        </div>
      )}
    </>
  );
};

export default NavButtons;
