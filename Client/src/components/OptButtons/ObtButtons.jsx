import React, { useState } from "react";
import style from "./OptButtons.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import StoreUpdate from "../StoreUpdate/StoreUpdate.jsx";
import { deleteStore } from "../../redux/actions.js";

const OptButtons = ({ storeId }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const stores = useSelector((state) => state.allStores);
  const [mostrarBotonesExtras, setMostrarBotonesExtras] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleNavButtonClick = () => {
    setMostrarBotonesExtras(!mostrarBotonesExtras);
  };

  const openModal = () => {
    setShowModal(true);
  };

  function handleDelete() {
    const confirmDelete = window.confirm(
      "¿Estás seguro que quieres eliminar tu tienda?"
    );

    if (confirmDelete) {
      dispatch(deleteStore(storeId));
      navigate("/").then(() => {
        // Esta función se ejecutará después de que el usuario haga clic en "OK"
        window.location.reload();
    })
    }
  }

  return (
    <>
      <button className={style.nav} onClick={handleNavButtonClick}>
        <img
          width="32"
          height="32"
          src="https://img.icons8.com/pulsar-line/48/FFFFFF/connection-status-off.png"
          alt="connection-status-off"
        />
      </button>
      {mostrarBotonesExtras && (
        <div className={style.botonesExtras}>
          <button className={style.edit} onClick={openModal}>
            <img
              width="24"
              height="24"
              src="https://img.icons8.com/glyph-neue/64/FFFFFF/edit--v1.png"
              alt="edit--v1"
            />
          </button>

          <Link to={"/misventas"}>
            <button className={style.edit}>
              <img
                width="24"
                height="24"
                src="https://img.icons8.com/pastel-glyph/64/FFFFFF/stocks-growth.png"
                alt="stocks-growth"
              />
            </button>
          </Link>

          <button className={style.delete} onClick={() => handleDelete()}>
            <img
              width="24"
              height="24"
              src="https://img.icons8.com/pulsar-line/48/FFFFFF/filled-trash.png"
              alt="filled-trash"
            />
          </button>
        </div>
      )}

      {showModal && (
        <div className={style.modal}>
          <div className={style.modalContent}>
            <button className={style.close} onClick={() => setShowModal(false)}>
              X
            </button>
            <StoreUpdate storeId={storeId}/>
          </div>
        </div>
      )}
    </>
  );
};

export default OptButtons;
