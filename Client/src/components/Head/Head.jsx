import React, { useEffect, useState, useRef } from "react";
import style from "./Head.module.css";
import { socket } from "../../App";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteUserNotif,
  getUserNotif,
  markNotiAsRead,
} from "../../redux/actions";
import bell from "../../assets/bell.png";
import bellY from "../../assets/bellY.png";

const Head = () => {
  const dispatch = useDispatch();
  const [showNotifications, setShowNotifications] = useState(false);
  const [liveNotifications, setLiveNotifications] = useState([]);
  const [hasUnreadNotification, setHasUnreadNotification] = useState();
  const [hoveredNotificationIndex, setHoveredNotificationIndex] = useState();
  const stores = useSelector((state) => state.allStoresCopy);
  const posts = useSelector((state) => state.allPostsCopy);
  const userData = useSelector((state) => state.userData);
  const savedNotif = useSelector((state) => state.userNotif);
  const mixturedNotifications = [...liveNotifications, ...savedNotif];
  const notifications = Array.from(
    new Set(mixturedNotifications.map((notification) => notification.content))
  ).map((content) =>
    mixturedNotifications.find(
      (notification) => notification.content === content
    )
  );

  const userId = userData?.id;

  useEffect(() => {
    let hasUnread;
    if (savedNotif > 1) {
      hasUnread = savedNotif.some(
        (notification) => notification.read === false
      );
      if (hasUnread && !hasUnreadNotification) {
        setHasUnreadNotification(true);
      }
    } else {
      hasUnread = savedNotif && savedNotif[0]?.read === false;
      if (hasUnread && !hasUnreadNotification) {
        setHasUnreadNotification(true);
      }
    }
  }, [dispatch, mixturedNotifications, hoveredNotificationIndex]);

  const toggleNotifications = () => {
    setShowNotifications((prevState) => !prevState);
  };

  /*  const handleMouseOver = (index) => {
    setHoveredNotificationIndex(index);
    if (notifications[index].read === false) {
      notifications[index].read = true;
      if (notifications[index]?.id !== undefined)
        dispatch(markNotiAsRead(notifications[index]?.id));
      setHasUnreadNotification(false);
    }
  }; */

  useEffect(() => {
    const handleNewMessage = (data) => {
      const { storeId, image, lastMessage, sender } = data;
      let messageNotificationText;
      if (storeId) {
        if (lastMessage.length < 10) {
          messageNotificationText = `Tu tienda ha recibido un nuevo mensaje de ${sender}: "${lastMessage}"`;
        } else {
          messageNotificationText = `Tu tienda ha recibido un nuevo mensaje de ${sender}`;
        }
      } else {
        if (lastMessage.length < 10) {
          messageNotificationText = `Has recibido un nuevo mensaje de ${sender}: "${lastMessage}"`;
        } else {
          messageNotificationText = `Has recibido un nuevo mensaje de ${sender}`;
        }
      }

      setLiveNotifications((prevNotifications) => [
        {
          content: messageNotificationText,
          image: image,
          read: false,
        },
        ...prevNotifications,
      ]);

      setHasUnreadNotification(true);
    };

    socket?.on("newMessage", handleNewMessage);
  }, [stores]);

  useEffect(() => {
    const handleNuevaCompra = (data) => {
      const { comprador, store, vendedor, post, allData } = data;
      const cantidad = allData.payUserData.quantity;
      const title = allData.payUserData.title;
      const storeName = store?.nombre;
      const image = post?.image;

      setLiveNotifications((prevNotifications) => [
        {
          content: `¡Tu compra de ${cantidad} ${title} ha sido notificada a ${storeName}!`,
          image: image,
          read: false,
        },
        ...prevNotifications,
      ]);

      setHasUnreadNotification(true);
      const DBdata = {
        cantidad: cantidad,
        title: title,
        comprador: comprador,
        store: store,
        vendedor: vendedor,
        post: post,
        allData: allData,
        userData: userData,
      };
      socket?.emit("compraRealizadaToDB", DBdata);
    };

    socket?.on("compraRealizada", (data) => {
      console.log("AAAAAAAAAAAAAAAAVERGA", data);
      handleNuevaCompra(data);
    });
  }, [stores]);

  useEffect(() => {
    const handleNuevaVenta = (data) => {
      const { comprador, store, vendedor, post, allData } = data;
      const cantidad = allData.payUserData.quantity;
      const title = allData.payUserData.title;
      const image = post?.image;
      const compradorName = comprador?.username;

      setLiveNotifications((prevNotifications) => [
        {
          content: `¡${compradorName} te ha comprado ${cantidad} ${title}!`,
          image: image,
          read: false,
        },
        ...prevNotifications,
      ]);

      setHasUnreadNotification(true);
      const DBdata = {
        cantidad: cantidad,
        comprador: comprador,
        store: store,
        vendedor: vendedor,
        post: post,
        allData: allData,
        title: title,
        compradorName: compradorName,
        image: image,
      };
      socket?.emit("ventaRealizadaToDB", DBdata);
    };

    socket?.on("ventaRealizada", (data) => {
      console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAA", data);
      handleNuevaVenta(data);
    });
  }, [stores]);

  useEffect(() => {
    const handleAddFavorite = (storeId) => {
      const store = stores.find((store) => store.id == storeId);

      /*   setLiveNotifications((prevNotifications) => [
        {
          content: `¡Se ha agregado "${store.nombre}" a favoritos!`,
          image: store.image,
          read: false,
        },
        ...prevNotifications,
      ]); */

      dispatch(getUserNotif(userId));

      setHasUnreadNotification(true);
    };

    socket?.on("addFavorite", handleAddFavorite);
  }, [stores]);

  useEffect(() => {
    const handleAddPostFavorite = (postId) => {
      dispatch(getUserNotif(userId));

      setHasUnreadNotification(true);
    };

    socket?.on("addFavoritePost", handleAddPostFavorite);
  }, [stores]);

  useEffect(() => {
    const handleWaitingStore = (data) => {
      const { nombre, image } = data;
      setLiveNotifications((prevNotifications) => [
        {
          content: `Su tienda "${nombre}" se encuentra en espera de aprobación`,
          image: image,
          read: false,
        },
        ...prevNotifications,
      ]);
      setHasUnreadNotification(true);
    };

    socket?.on("waitingStore", handleWaitingStore);
  }, [stores]);

  useEffect(() => {
    const handleApprovedStore = (data) => {
      const { nombre, image } = data;
      setLiveNotifications((prevNotifications) => [
        {
          content: `Su tienda "${nombre}" fue aprobada!`,
          image: image,
          read: false,
        },
        ...prevNotifications,
      ]);
      setHasUnreadNotification(true);
    };

    socket?.on("approvedStore", handleApprovedStore);
  }, [stores]);

  const handleClearNotifications = () => {
    setLiveNotifications([]);
    dispatch(deleteUserNotif(userId));
    setShowNotifications(false);
    setHoveredNotificationIndex(null);
    setHasUnreadNotification(false);
  };

  useEffect(() => {
    if (!hasUnreadNotification) {
      setHasUnreadNotification(false);
    }
  }, [hasUnreadNotification]);

  return (
    <>
      <div className={style.background}>
        {hasUnreadNotification ? (
          <button className={style.notifications} onClick={toggleNotifications}>
            <img
              width="28"
              height="28"
              src={bellY}
              alt="campana amarilla"
              className={style.bellMove}
            />
          </button>
        ) : (
          <button className={style.notifications} onClick={toggleNotifications}>
            <img
              width="28"
              height="28"
              src={bell}
              alt="campana"
              className={style.bell}
            />
          </button>
        )}
      </div>
      {showNotifications && (
        <div className={style.modal}>
          {notifications.map((notification, index) => (
            <div
              key={index}
              /* onMouseOver={() => handleMouseOver(index)} */
              className={style.noti}
            >
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
