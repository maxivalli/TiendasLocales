import React, { useEffect, useState } from "react";
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
  const { linkName } = useParams();
  const stores = useSelector((state) => state.allStores);
  const storePosts = useSelector((state) => state.storePosts);
  const storeName = linkName.replace(/-/g, " ");
  const selectedStore = stores.find((store) => store.nombre == storeName);
  const storeId = selectedStore?.id
  const direccionObj = JSON.parse(selectedStore.direccion || '{}');
  const calle = direccionObj.calle || '';
  const numero = direccionObj.numero || '';
  const piso = direccionObj.piso || '';
  const depto = direccionObj.depto || '';

 
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    dispatch(getStorePosts(storeId))
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching store posts:", error);
        setLoading(false);
      });
  }, [dispatch, storeId]);

  if (loading) {
    return (
      <div className={style.spinner}>
        <div className={style.bounce1}></div>
        <div className={style.bounce2}></div>
        <div className={style.bounce3}></div>
      </div>
    );
  }

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
            <p>📍 {calle} {numero} (piso: {piso} local: {depto})</p>
            <p>⏰ {selectedStore.horarios}</p>
            <p>{selectedStore.categoria}</p>
          </div>

          <div className={style.info2}>
            <h3>⭐️⭐️⭐️⭐️</h3>
          </div>
        </div>

        <div className={style.title}>
          <h2>Productos disponibles</h2>
        </div>

        <div className={style.store2}>
          {storePosts.map((post, index) => (
            <CardSquare key={index} {...post} storeId={storeId} />
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
