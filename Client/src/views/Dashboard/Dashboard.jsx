import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import style from "./Dashboard.module.css";
import { getAllStores } from "../../redux/actions";
import axios from "axios";
import Swal from "sweetalert2";
import { socket } from "../../App";

const Dashboard = () => {
  const dispatch = useDispatch();
  const stores = useSelector((state) => state.allStores);
  const storesRef = useRef(stores);
  const [filterStores, setStores] = useState([]);

  useEffect(() => {
    dispatch(getAllStores());
  }, [dispatch]);

  useEffect(() => {
    const filtered = stores.filter(
      (store) => store.habilitado === "noHabilitado"
    );
    filtered.map(async (store) => {
      const response = await axios.get(`/users/anotherUserId?id=${store.userId}`);
      const userData = response.data;
      if(userData.accT)
      setStores((prevStores) => [...prevStores, store]);
    })
}, [dispatch, storesRef]);

  const handleHabilitacion = async (id) => {
    try {
      const response = await axios.post("/tiendas/habStore", { id: id });
      if (response) {
        const storeData = response.data
        setStores((prevStores) =>
          prevStores.filter((store) => store.id !== id)
        );
        socket?.emit("approvedStore", storeData);
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
        <div className={style.head}>
          <h2>Panel de control</h2>
          <p>Tiendas en espera de aprobacion</p>
        </div>

        <div className={style.stores}>
          {filterStores.map((store, index) => (
            <div key={index} className={style.storeCard}>
              <div className={style.title}>
                <h2>{store.nombre}</h2>
              </div>

              <div className={style.info}>
                <div className={style.avatar}>
                  <img src={store.image} alt={store.nombre} />
                </div>

                <div className={style.text}>
                  <p>📬 {store.email}</p>
                  <p>
                    📍 {store.direccion.calle} {store.direccion.numero} (piso:{" "}
                    {store.direccion.piso} local: {store.direccion.depto})
                  </p>
                  <p>{store.categoria}</p>
                </div>
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
