import { React, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChatEngine } from "react-chat-engine";
import "./Messages.css";
import { useNavigate } from "react-router";
import { getToken } from "firebase/messaging";
import { getAuth, signInAnonymously } from "firebase/auth";
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

  const loginNotifications = () => {
    signInAnonymously(getAuth()).then((usuario) => console.log(usuario));
  };

  const requestPermission = () => {
    console.log("Requesting User Permission......");
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        console.log("Notification User Permission Granted.");
        console.log("waiting...");
        setTimeout(() => {
          return getToken(messaging, {
            vapidKey:
              "BNY5OiGgDKe6EVWr76IohPCDDrKwCdr48QVhp9K5T1CdCDYkJ3dUbUl2ciToadj8OPGO2JTpPaEA7kwXe4w0aMA",
          })
            .then((currentToken) => {
              if (currentToken) {
                console.log("Client Token: ", currentToken);
              } else {
                console.log("Failed to generate the app registration token.");
              }
            })
            .catch((err) => {
              console.log(
                "An error occurred when requesting to receive the token.",
                err
              );
            });
        }, 1500);
      } else {
        console.log("User Permission Denied.");
      }
    });
  };

  useEffect(() => {
    loginNotifications();
    requestPermission();
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
