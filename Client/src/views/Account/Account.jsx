import React, { useState, useEffect } from "react";
import Head from "../../components/Head/Head";
import { useAuth0 } from "@auth0/auth0-react";
import UbiForm from "../../components/UbiForm/UbiForm";
import CardSquare from "../../components/CardSquare/CardSquare";
import Filters from '../../components/Filters/Filters'
import pizza from "../../assets/pizza.jpg";
import style from "./Account.module.css";
import { useSelector } from "react-redux";

const Account = ({ setAuth, setUserData }) => {
  const userData = useSelector((state) => state.userData)
  console.log(userData);
  const { user, logout } = useAuth0(); // Fix here: destructure 'logout' correctly
  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    setShowModal(true);
  };

  const allLogOut = () => {
    localStorage.removeItem("token");
    setAuth(false);
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  const handleAddressAdded = (newAddress) => {
    setUserData((prevUserData) => ({
      ...prevUserData,
      direccion: { direccion: newAddress },
    }));
    setShowModal(false);
  };
  return (
    <>
      <Filters/>
      <Head />
      <div className={style.viewAccount}>
        
        <div className={style.account}>
          <div className={style.avatar}>
            <img src={userData && userData.image} alt="avatar" />
          </div>

          <div className={style.info}>
            <h2>{userData && userData.username}</h2>
            <p>{userData && userData.email}</p>
            <p>
            {userData && userData.direccion && userData.direccion.direccion.trim() !== ""
              ? userData.direccion.direccion
              : "Sin dirección"}
          </p>
            <p>
              {userData && userData.averageRating !== 0
                ? userData.averageRating
                : "Aún no te han calificado"}
            </p>
          </div>

          <div className={style.info2}>
            <button onClick={openModal} className={style.envios}>
              <img
                width="22"
                height="22"
                src="https://img.icons8.com/ios-filled/50/FFFFFF/mailbox-opened-flag-down.png"
                alt="mailbox-opened-flag-down"
              />
            </button>

            <button onClick={allLogOut} className={style.salir}>
              <img
                width="22"
                height="22"
                src="https://img.icons8.com/ios-filled/50/FFFFFF/logout-rounded.png"
                alt="logout-rounded"
              />
            </button>
          </div>
        </div>

        <div className={style.title}>
          <h2>Mis compras</h2>
        </div>

        <div className={style.misCompras}>
          <CardSquare
            image={pizza}
            title={"Pizza Napolitana"}
            price={"5000"}
            store={"Pizza Land"}
          />
          <CardSquare
            image={pizza}
            title={"Pizza Napolitana"}
            price={"5000"}
            store={"Pizza Land"}
          />
        </div>

          {showModal && (
          <div className={style.modal}>
            <div className={style.modalContent}>
              <button
                className={style.close}
                onClick={() => setShowModal(false)}
              >
                X
              </button>
              <UbiForm userData={userData} onAddressAdded={handleAddressAdded} />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Account;
