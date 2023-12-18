import React, { useEffect } from "react";
import CardSquare from "../../components/CardSquare/CardSquare";
import Filters from "../../components/Filters/Filters";
import Head from "../../components/Head/Head";
import OptButtons from '../../components/OptButtons/ObtButtons'
import { Link } from "react-router-dom";
import style from "./MyStore.module.css";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getStorePosts } from "../../redux/actions";

const MyStore = () => {
  
  const dispatch = useDispatch();
  const { storeId } = useParams();
  const stores = useSelector((state) => state.allStores);
  const storePosts = useSelector((state) => state.storePosts)
  const allPosts = useSelector((state) => state.allPosts)
  const selectedStore = stores.find((store) => store.id == storeId);
  const direccionObj = JSON.parse(selectedStore.direccion || '{}');
  const calle = direccionObj.calle || '';
  const numero = direccionObj.numero || '';
  const piso = direccionObj.piso || '';
  const depto = direccionObj.depto || '';

  useEffect(() => {
    dispatch(getStorePosts(storeId))
  }, [dispatch, allPosts])
  
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
        <Link to="/addproduct">
        <div className={style.agregar}>
          <button>Agregar</button>
        </div>
        </Link>
        <div className={style.title}>
          <h2>Productos disponibles</h2>
        </div>

        <div className={style.store2}>
        {storePosts.map((post, index) => (
          <CardSquare key={index} {...post} storeId={storeId}/>
          ))}
        </div>
        <OptButtons storeId={storeId} />
      </div>
    </>
  );
};

export default MyStore;
