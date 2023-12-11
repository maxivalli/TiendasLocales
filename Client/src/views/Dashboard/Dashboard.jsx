import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CardsStore from "../../components/CardsStore/CardsStore";
import style from "./Dashboard.module.css";
import { getAllStores } from "../../redux/actions";
import axios from "axios";
import Swal from "sweetalert2";

const Dashboard = () => {
  const dispatch = useDispatch();
  const stores = useSelector((state) => state.allStores);
  const [filterStores, setStores] = useState([]);

  useEffect(() => {
    dispatch(getAllStores());
  }, [dispatch]);

  useEffect(() => {
    const filtered = stores.filter((store) => store.habilitado === "noHabilitado");
    setStores(filtered);
  }, [dispatch, stores]);

  const handleHabilitacion = async (id) => {
    try {
      const response = await axios.post("/tiendas/habStore", { id: id });
      if (response) {
        // Actualizar el estado local eliminando la tienda aprobada
        setStores((prevStores) => prevStores.filter((store) => store.id !== id));

        Swal.fire({
          icon: "success",
          title: `Tienda Aprobada!`,
          text: "La tienda fue aprobada, se mandara un mail al usuario!",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className={style.home}>

        <div className={style.title}>
          <h1>Admin Dashboard</h1>
          <p>Tiendas en espera de aprobacion</p>
        </div>

        <div className={style.stores}>
        {filterStores.map((store, index) => (
            <div key={index} className={style.storeCard}>
              <h2>{store.nombre}</h2>
              <img src={store.image} className={style.image} alt={store.nombre} />
              <p>Email: {store.email}</p>
              <p>Dirección: {store.direccion}</p>
              <p>Creador Id: {store.userId}</p>
              <button onClick={() => handleHabilitacion(store.id)}>HABILITAR TIENDA</button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Dashboard;