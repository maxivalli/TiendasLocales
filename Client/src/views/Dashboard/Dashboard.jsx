import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CardsStore from "../../components/CardsStore/CardsStore";
import style from "./Dashboard.module.css";
import { getAllStores } from "../../redux/actions";
import axios from "axios";
import Swal from "sweetalert2";
import { socket } from "../../App";


const Dashboard = () => {
  const dispatch = useDispatch();
  const stores = useSelector((state) => state.allStores);
  const [filterStores, setStores] = useState([]);

  useEffect(() => {
    dispatch(getAllStores());
  }, [dispatch]);

  useEffect(() => {
    const filtered = stores.filter(
      (store) => store.habilitado === "noHabilitado"
    );
    filtered.forEach(async (store) => {
      const response = await axios.get(`/users/anotherUserId?id=${store.userId}`);
      const userData = response.data;
      if(userData.accT)
        setStores([store])
    })
  }, [dispatch, stores]);

  const handleHabilitacion = async (id) => {
    try {
      const response = await axios.post("/tiendas/habStore", { id: id });
      if (response) {
        const storeData = response.data
        // Actualizar el estado local eliminando la tienda aprobada
        setStores((prevStores) =>
          prevStores.filter((store) => store.id !== id)
        );
        socket?.emit("approvedStore", storeData)
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
          <h2>Panel de control</h2>
          <p>Tiendas en espera de aprobacion</p>
        </div>

        <div className={style.stores}>

          {filterStores.map((store, index) => (

            <div key={index} className={style.storeCard}>
              <div className={style.avatar}>
                <h2>{store.nombre}</h2>
                <img
                  src={store.image}
                  className={style.image}
                  alt={store.nombre}
                />
              </div>
              <div className={style.info}>
                <p>{store.email}</p>
                <p>
              📍 {store.direccion.calle}{" "}
              {store.direccion.numero} (piso:{" "}
              {store.direccion.piso} local:{" "}
              {store.direccion.depto})
            </p>
                <p>{store.categoria}</p>
              </div>
              <div className={style.button}>
                <button onClick={() => handleHabilitacion(store.id)}>
                  Habilitar
                </button>
              </div>
            </div>
          ))}
          
        </div>
      </div>
    </>
  );
};

export default Dashboard;
