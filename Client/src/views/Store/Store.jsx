import React, { useEffect } from "react";

import CardSquare from "../../components/CardSquare/CardSquare";
import Filters from "../../components/Filters/Filters";
import Head from "../../components/Head/Head";
import NavButtons from "../../components/NavButtons/NavButtons";
import hambur from "../../assets/hambur.jpg";
import style from "./Store.module.css";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const Store = () => {
  const dispatch = useDispatch();
  const { storeId } = useParams();

const stores = useSelector((state) => state.allStores)

const selectedStore = stores.find((store) => store.id == storeId);


  return (
    <>
      <Filters />
      <Head />
      <div className={style.viewStore}>

        <div className={style.store}>

          <div className={style.avatar}>
            <img src={selectedStore.image} alt="avatar" />
          </div>

          <div className={style.info}>
            <h2>{selectedStore.nombre}</h2>
            <p>{selectedStore.direccion}</p>
            <p>{selectedStore.horarios}</p>
            <p>{selectedStore.categoria}</p>
          </div>

          <div className={style.info2}>
            <h3>⭐️⭐️⭐️⭐️</h3>
            <div className={style.redes}>
              <button>
                <img
                  width="40"
                  height="40"
                  src="https://img.icons8.com/color/48/facebook-new.png"
                  alt="facebook-new"
                />
              </button>
              <button>
                <img
                  width="40"
                  height="40"
                  src="https://img.icons8.com/color/48/whatsapp--v1.png"
                  alt="whatsapp--v1"
                />
              </button>
              <a
  href={selectedStore.instagram}
  target="_blank"
  rel="noopener noreferrer"
>
  <button>
    <img
      width="40"
      height="40"
      src="https://img.icons8.com/fluency/48/instagram-new.png"
      alt="instagram-new"
    />
  </button>
</a>
            </div>
          </div>
        </div>

        <div className={style.title}>
          <h2>Productos disponibles</h2>
        </div>

        <div className={style.store2}>
          <CardSquare
            image={hambur}
            title={"Hamburguesa Americana"}
            price={"$2500"}
            store={"Pizza Land"}
          />
        </div>
        <div className={style.buttons}>
          <NavButtons />
        </div>
        
      </div>
    </>
  );
};

export default Store;
