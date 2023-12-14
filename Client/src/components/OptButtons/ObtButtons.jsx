import React, { useState } from "react";
import style from "./OptButtons.module.css";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const OptButtons = ({ storeId }) => {
  const stores = useSelector((state) => state.allStores);
  const [mostrarBotonesExtras, setMostrarBotonesExtras] = useState(false);
  const store = stores.find((store) => store.id == storeId);

  const handleNavButtonClick = () => {
    setMostrarBotonesExtras(!mostrarBotonesExtras);
  };

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
          <Link to={"/editstore"}>
            <button className={style.edit}>
              <img
                width="30"
                height="30"
                src="https://img.icons8.com/glyph-neue/64/FFFFFF/edit--v1.png"
                alt="edit--v1"
              />
            </button>
          </Link>
          <Link to={"/sales"}>
            <button className={style.edit}>
              <img
                width="24"
                height="24"
                src="https://img.icons8.com/pastel-glyph/64/FFFFFF/stocks-growth.png"
                alt="stocks-growth"
              />
            </button>
          </Link>

          <button className={style.delete}>
            <img
              width="24"
              height="24"
              src="https://img.icons8.com/pulsar-line/48/FFFFFF/filled-trash.png"
              alt="filled-trash"
            />
          </button>
        </div>
      )}
    </>
  );
};

export default OptButtons;
