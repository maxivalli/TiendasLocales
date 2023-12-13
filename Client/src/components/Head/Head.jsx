import React, { useEffect, useState } from "react";
import Logo from "../../assets/TLlogoAlpha.png";
import style from "./Head.module.css";
import { socket } from "../../App";
import { useDispatch, useSelector } from "react-redux";
import { deleteUserNotif, getAllPosts, getUserNotif } from "../../redux/actions";

const Head = () => {
  const dispatch = useDispatch()
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [hasUnreadNotification, setHasUnreadNotification] = useState(false);
  const [clearNotifications, setClearNotifications] = useState(false);
  const stores = useSelector((state) => state.allStores);
  const userData = useSelector((state)=> state.userData)
  const savedNotif = useSelector((state)=> state.userNotif)



  const userId = userData?.id



useEffect(()=> {
  dispatch(getUserNotif(userId))
}, [dispatch])





  const toggleNotifications = () => {
    setShowNotifications((prevState) => !prevState);
    if (hasUnreadNotification) {
      setHasUnreadNotification(false);
    }
    if (clearNotifications) {
      setClearNotifications(false);
    }
  };

  useEffect(() => {
    const handleAddFavorite = (storeId) => {
      console.log("socket addFavorite recibido por el front");
      const store = stores.find((store) => store.id == storeId);

      setNotifications((prevNotifications) => [
        {
          text: `¡Se ha agregado "${store.nombre}" a favoritos!`,
          image: store.image,
        },
        ...prevNotifications,
      ]);

      setHasUnreadNotification(true);
    };

    socket?.on("addFavorite", handleAddFavorite);

    return () => {
      socket?.off("addFavorite", handleAddFavorite);
    };
  }, [stores]);

  const handleClearNotifications = () => {
    setNotifications([]);
    setHasUnreadNotification(false);
    dispatch(deleteUserNotif(userId));
    setClearNotifications(true); 
  };

  return (
    <>
      <div className={style.background}>
        <img
          src={Logo}
          alt="logo"
          className={style.logo}
          onClick={toggleNotifications}
        />
        {hasUnreadNotification && (
          <div className={style.dot}></div>
        )}
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
        <div className={style.modal}>
          {notifications.map((notification, index) => (
            <div key={index}>
              <button className={style.notifAcces}>
                <img src={notification.image} alt="" />
                <p>{notification.text}</p>
              </button>
            </div>
          ))}
           {!clearNotifications && savedNotif.map((notification) => (
            <div key={notification.id}>
              <button className={style.notifAcces}>
                <img src={notification.image} alt="" />
                <p>{notification.content}</p>
              </button>
            </div>
          ))}
          <button className={style.close} onClick={handleClearNotifications}>
            Borrar notificaciones
          </button>
        </div>
      )}
    </>
  );
};

export default Head;
