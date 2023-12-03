import { React, useState } from "react";
import Logo from "../../assets/TLlogoAlpha.png";
import userAvatar from "../../assets/userAvatar.png";
import storeAvatar from "../../assets/storeAvatar.png";
import style from "./Head.module.css";

const Head = () => {
  const [showNotifications, setShowNotifications] = useState(false);

  const toggleNotifications = () => {
    setShowNotifications((prevState) => !prevState);
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
        <div className={style.modal}>
          <div>
            <button className={style.notifAcces}>
              <img src={userAvatar} alt="" />
              <p>Notificación ejemplo 1</p>
            </button>
          </div>
          <div>
            <button className={style.notifAcces}>
              <img src={userAvatar} alt="" />
              <p>Notificación ejemplo 2</p>
            </button>
          </div>
          <div>
            <button className={style.notifAcces}>
              <img src={storeAvatar} alt="" />
              <p>Notificación ejemplo 3</p>
            </button>
          </div>
          <button onClick={toggleNotifications} className={style.close}>
            Cerrar
          </button>
        </div>
      )}
    </>
  );
};

export default Head;
