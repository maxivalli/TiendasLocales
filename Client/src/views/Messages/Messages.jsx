import { React, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChatEngine } from "react-chat-engine";
import "./Messages.css";
import { getUserStore } from "../../redux/actions";
import { useNavigate } from "react-router";

const Messages = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [prevUrl, setPrevUrl] = useState(window.location.href);
  console.log(prevUrl);

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
  const isUserAccount = lastPathSegment == "user";
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
    const handleUrlChange = () => {
      // Forzar la recarga de la página
      window.location.reload();
    };

    // Suscribe al evento de cambio de URL
    window.addEventListener("popstate", handleUrlChange);

    // Limpia el evento al desmontar el componente
    return () => {
      window.removeEventListener("popstate", handleUrlChange);
    };
  }, [navigate]);

  useEffect(() => {
    if ("Notification" in window) {
      if (
        Notification.permission !== "granted" &&
        Notification.permission !== "denied"
      ) {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            console.log("Permiso para notificaciones concedido.");
          }
        });
      }
    }

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

  return (
    <>
      <div className="chat">
        <ChatEngine
          projectID="59fa8828-96fe-4a26-a226-18d513d30b1e"
          userName={chatUserName}
          userSecret={userSecret}
          height="calc(100vh - 60px)"
          offset={-3}
        />
      </div>
    </>
  );
};

export default Messages;
