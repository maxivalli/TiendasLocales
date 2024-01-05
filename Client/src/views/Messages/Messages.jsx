import { React, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChatEngine } from "react-chat-engine";
import "./Messages.css";
import style from "../More/More.module.css";
import { useNavigate } from "react-router";
import { getToken } from "firebase/messaging";
import { getAuth, signInAnonymously } from "firebase/auth";
import { messaging } from "../../components/Firebase/config";

import { socket } from "../../App";
import { updateUser } from "../../redux/actions";

const Messages = ({ SWregistration }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [savedStoreData, setSavedStoreData] = useState(() => {
    const storedData = localStorage.getItem("userStore");
    return storedData ? JSON.parse(storedData) : null;
  });
  const [loading, setLoading] = useState(true);

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
    setLoading(false);
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
      if (!SWregistration) {
        try {
          const registration = await navigator.serviceWorker.register(
            "/firebase-messaging-sw.js"
          );
          SWregistration = registration;
        
        } catch (error) {
          console.error("Error al registrar el Service Worker:", error);
          return;
        }
      }

      const token = await getToken(messaging, {
        vapidKey:
          "BNY5OiGgDKe6EVWr76IohPCDDrKwCdr48QVhp9K5T1CdCDYkJ3dUbUl2ciToadj8OPGO2JTpPaEA7kwXe4w0aMA",
        serviceWorkerRegistration: SWregistration,
      }).catch((error) => {
        
      });

      if (token) {
       
        userData.FCMtoken = token;
        const id = userData.id;
        dispatch(updateUser(id, userData));
      } else {
        console.log();
      }
    };

    loginNotifications();
    activarMensajes();
  }, [SWregistration]);

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

  
  if (loading) {
    return (
      <div className={style.spinner}>
        <div className={style.bounce1}></div>
        <div className={style.bounce2}></div>
        <div className={style.bounce3}></div>
      </div>
    );
  }
  return (
    <>
      <div className="chat">
        <ChatEngine
          publicKey="236f9c42-06cc-414f-98cd-b7465ea5c29e"
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
