import React, { useEffect, useState, useRef } from "react";
import style from "./Head.module.css";
import { socket } from "../../App";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteUserNotif,
  getUserNotif,
  markNotiAsRead,
} from "../../redux/actions";
import bell from '../../assets/bell.png'
import bellY from '../../assets/bellY.png'

const Head = () => {
  const dispatch = useDispatch();
  const [showNotifications, setShowNotifications] = useState(false);
  const [liveNotifications, setLiveNotifications] = useState([]);
  const [hasUnreadNotification, setHasUnreadNotification] = useState(false);
  const [hoveredNotificationIndex, setHoveredNotificationIndex] = useState(null);
  const [clearNotifications, setClearNotifications] = useState(false);
  const stores = useSelector((state) => state.allStoresCopy);
  const users = useSelector((state) => state.allUsers);
  let allUsers
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
allUsers = users
  }, [users]);

  useEffect(() => {
    if (userId) {
      dispatch(getUserNotif(userId));
    }
  }, [dispatch, showNotifications]);

  useEffect(() => {
    const hasUnread = savedNotif.some(
      (notification) => notification.read === false
    );
    if (hasUnread) {
      setHasUnreadNotification(true);
    }
  }, [dispatch, notifications, hoveredNotificationIndex]);

  const toggleNotifications = () => {
    setShowNotifications((prevState) => !prevState);
    if (hasUnreadNotification) {
      setHasUnreadNotification(false);
    }
    if (clearNotifications) {
      setClearNotifications(false);
    }
  };

  const handleMouseOver = (index) => {
    setHoveredNotificationIndex(index);
    if (notifications[index].read === false) {
      notifications[index].read = true;
      dispatch(markNotiAsRead(notifications[index]?.id));
    }
  };

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

    return () => {
      socket?.off("newMessage", handleNewMessage);
    };
  }, [stores]);

  useEffect(() => {
    let cantidad
    let title
    let storeName
    let image
    let store
    let post
    let comprador
    let allData
    let vendedor
    const handleNuevaCompra = (data) => {
      const {comprador, store, vendedor, post, allData} = data
      cantidad = allData.payUserData.quantity
      title = allData.payUserData.title
      storeName = store?.nombre
      image = post?.image
      store = store
      post = post
      comprador = comprador
      vendedor = vendedor
      allData = allData
      console.log("SOCKET RECIBIDO COMPRA");

      setLiveNotifications((prevNotifications) => [
        {
          content: `¡Tu compra de ${cantidad} ${title} ha sido notificada a ${storeName}!`,
          image: image,
          read: false,
        },
        ...prevNotifications,
      ]);

      setHasUnreadNotification(true);
    };
    socket?.on("compraRealizada", handleNuevaCompra);


    const DBdata = {cantidad, title, comprador, store, vendedor, post, allData, userData}
    socket?.emit("compraRealizadaToDB", DBdata)


    return () => {
      socket?.off("compraRealizada", handleNuevaCompra);
      socket?.emit("compraRealizadaToDB", DBdata)
    };
  }, [stores]);

  useEffect(() => {
    const handleNuevaVenta = (data) => {
      const {comprador, store, vendedor, post, allData} = data
      const cantidad = allData.payUserData.quantity
      const title = allData.payUserData.title
      const image = post?.image
      const compradorName = comprador?.username
      console.log("SOCKET RECIBIDO VENTA");

      setLiveNotifications((prevNotifications) => [
        {
          content: `¡${compradorName} te ha comprado ${cantidad} ${title}!`,
          image: image,
          read: false,
        },
        ...prevNotifications,
      ]);

      setHasUnreadNotification(true);
      const DBdata = {cantidad, comprador, store, vendedor, post, allData, title, compradorName}
      socket?.emit("ventaRealizadaToDB", DBdata)
    };

    socket?.on("ventaRealizada", handleNuevaVenta);


    return () => {
      socket?.off("ventaRealizada", handleNuevaVenta);
    };
  }, [stores]);


  useEffect(() => {
    const handleAddFavorite = (storeId) => {
      const store = stores.find((store) => store.id == storeId);

      setLiveNotifications((prevNotifications) => [
        {
          content: `¡Se ha agregado "${store.nombre}" a favoritos!`,
          image: store.image,
          read: false,
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

  useEffect(() => {
    const handleAddPostFavorite = (postId) => {
      const post = posts?.find((post) => post.id == postId);

      setLiveNotifications((prevNotifications) => [
        {
          content: `¡Se ha agregado "${post?.title}" a favoritos!`,
          image: post?.image,
          read: false,
        },
        ...prevNotifications,
      ]);

      setHasUnreadNotification(true);
    };

    socket?.on("addFavoritePost", handleAddPostFavorite);

    return () => {
      socket?.off("addFavoritePost", handleAddPostFavorite);
    };
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

    return () => {
      socket?.off("waitingStore", handleWaitingStore);
    };
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

    return () => {
      socket?.off("approvedStore", handleApprovedStore);
    };
  }, [stores]);

  const handleClearNotifications = () => {
    setLiveNotifications([]);
    setHasUnreadNotification(false);
    dispatch(deleteUserNotif(userId));
    setClearNotifications(true);
    setShowNotifications(false);
    setHoveredNotificationIndex(null); // Limpiar el índice cuando se cierran las notificaciones.
  };

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
              onMouseOver={() => handleMouseOver(index)}
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
