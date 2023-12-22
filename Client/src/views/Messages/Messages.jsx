import { React, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChatEngine } from "react-chat-engine";
import "./Messages.css";
import { useNavigate } from "react-router";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getToken } from "firebase/messaging";

import { messaging } from "../../components/Firebase/config";

import { socket } from "../../App";
import { updateUser, updateUserData } from "../../redux/actions";

const Messages = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [savedStoreData, setSavedStoreData] = useState(() => {
    const storedData = localStorage.getItem("userStore");
    return storedData ? JSON.parse(storedData) : null;
  });

  const userData = useSelector((state) => state?.userData);
  const userName = userData?.username;
  const userEmail = userData?.email;

  const userStore = useSelector((state) => state?.userStore);
  const storeName = userStore?.nombre;
  const storeEmail = userStore?.email;

  useEffect(() => {
    if (userStore) {
      localStorage.setItem("userStore", JSON.stringify(userStore));
    }
  }, [userStore]);

  const url = new URL(window.location.href);
  const lastPathSegment = url.href.split("/").pop();
  const isUserAccount = lastPathSegment == "usuario";
  const chatUserName = isUserAccount
    ? userName
    : storeName
    ? storeName
    : savedStoreData.nombre;
  const userSecret = isUserAccount
    ? userEmail
    : storeEmail
    ? storeEmail
    : savedStoreData.email;

  useEffect(() => {
    const loginNotifications = () => {
      signInAnonymously(getAuth()).then((usuario) => console.log(usuario));
    };
    const activarMensajes = async () => {
      const token = await getToken(messaging, {
        vapidKey:
          "BNY5OiGgDKe6EVWr76IohPCDDrKwCdr48QVhp9K5T1CdCDYkJ3dUbUl2ciToadj8OPGO2JTpPaEA7kwXe4w0aMA",
      }).catch((error) => console.log("Error al generar el token", error));
      if (token) {
        console.log("tu token: ", token);
        userData.FCMtoken = token;
        const id = userData.id;
        dispatch(updateUser(id, userData));
      }
      if (!token) console.log("no hay token");
    };
    loginNotifications();
    activarMensajes();
  }, []);

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

  const [chats, setChats] = useState();

  return (
    <>
      <div className="chat">
        <ChatEngine
          publicKey="59fa8828-96fe-4a26-a226-18d513d30b1e"
          userName={chatUserName}
          userSecret={userSecret}
          onGetChats={(chats) => {
            setChats(chats);
          }}
          onNewMessage={(chatId, message) => {
            const chat = chats?.find((chat) => chat?.id === chatId);
            const people = chat.people;
            const lastMessage = message.text.replace(/<\/?p>/g, "");
            const sender = message.sender_username;
            const messageData = { people, lastMessage, sender, userData };
            socket?.emit("newMessage", messageData);
          }}
          height="calc(100vh - 60px)"
          offset={-3}
        />
      </div>
    </>
  );
};

export default Messages;
