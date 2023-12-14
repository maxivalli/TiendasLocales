import React, { useEffect } from "react";
import CardSquare from "../../components/CardSquare/CardSquare";
import Filters from "../../components/Filters/Filters";
import Head from "../../components/Head/Head";
import NavButtons from "../../components/NavButtons/NavButtons";
import style from "./Store.module.css";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getStorePosts } from "../../redux/actions";

const Store = () => {
  
  const dispatch = useDispatch();
  const { storeId } = useParams();

  const stores = useSelector((state) => state.allStores);
  const storePosts = useSelector((state) => state.storePosts)

  const selectedStore = stores.find((store) => store.id == storeId);

  useEffect(() => {
    dispatch(getStorePosts(storeId))
  }, [dispatch])
  
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
            <p>📍 {selectedStore.direccion}</p>
            <p>⏰ {selectedStore.horarios}</p>
            <p>{selectedStore.categoria}</p>
          </div>

          <div className={style.info2}>
            <h3>⭐️⭐️⭐️⭐️</h3>
            <div className={style.redes}>
              <button>
                <img
                  width="32"
                  height="32"
                  src="https://img.icons8.com/color/48/facebook-new.png"
                  alt="facebook-new"
                />
              </button>
              
              <button>
                <img
                  width="32"
                  height="32"
                  src="https://img.icons8.com/color/48/whatsapp--v1.png"
                  alt="whatsapp--v1"
                />
              </button>

              <button>
                <img
                  width="32"
                  height="32"
                  src="https://img.icons8.com/fluency/48/instagram-new.png"
                  alt="instagram-new"
                />
              </button>
            </div>
          </div>
        </div>

        <div className={style.title}>
          <h2>Productos disponibles</h2>
        </div>

        <div className={style.store2}>
        {storePosts.map((post, index) => (
          <CardSquare key={index} {...post} storeId={storeId}/>
          ))}
        </div>
        <div className={style.buttons}>
          <NavButtons storeId={storeId} />
        </div>
      </div>
    </>
  );
};

export default Store;
