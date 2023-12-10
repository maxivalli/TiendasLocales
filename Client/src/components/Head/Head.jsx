import React, { useEffect, useState } from "react";
import Logo from "../../assets/TLlogoAlpha.png";
import userAvatar from "../../assets/userAvatar.png";
import storeAvatar from "../../assets/storeAvatar.png";
import style from "./Head.module.css";
import { socket } from "../../App";
import { useSelector } from "react-redux";

const Head = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const stores = useSelector((state) => state.allStores);

  const toggleNotifications = () => {
    setShowNotifications((prevState) => !prevState);
  };

  useEffect(() => {
    const handleAddFavorite = (storeId) => {
      console.log("socket addFavorite recibido por el front");
      const store = stores.find((store) => store.id === storeId);

      // Agregar nueva notificación al principio de la lista
      setNotifications((prevNotifications) => [
        {
          text: `¡Se ha agregado "${store.nombre}" a favoritos!`,
          image: store.image,
        },
        ...prevNotifications,
      ]);

      // Mostrar notificaciones al recibir una nueva
      setShowNotifications(true);
    };

    // Suscribirse al evento al montar el componente
    socket?.on("addFavorite", handleAddFavorite);

    // Limpiar la suscripción al desmontar el componente
    return () => {
      socket?.off("addFavorite", handleAddFavorite);
    };
  }, [stores]);

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <>
      <div className={style.background}>
        <img src={Logo} alt="logo" className={style.logo} />
        <button className={style.notifications} onClick={toggleNotifications}>
          <img
            width="28"
            height="28"
            src="https://img.icons8.com/ios-filled/50/FFFFFF/appointment-reminders--v1.png"
            alt="appointment-reminders--v1"
            className={style.bell}
          />
        </button>
      </div>
      {showNotifications && (
        <>
        <div className={style.modal}>
          {notifications.map((notification, index) => (
            <div key={index}>
              <button className={style.notifAcces}>
                <img src={notification.image} alt="" />
                <p>{notification.text}</p>
              </button>
            </div>
          ))}
          {/* <div className={style.dot}>🔵</div> */}
          <button className={style.close} onClick={clearNotifications}>
            Borrar notificaciones
          </button>
        </div>
        </>
      )}
    </>
  );
};

export default Head;
