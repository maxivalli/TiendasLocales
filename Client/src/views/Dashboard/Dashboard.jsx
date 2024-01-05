import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import style from "./Dashboard.module.css";
import { getAllStores } from "../../redux/actions";
import axios from "axios";
import Swal from "sweetalert2";
import { socket } from "../../App";
import Head from "../../components/Head/Head";
import SearchBar from "../../components/SearchBar/SearchBar";

const Dashboard = () => {
  const dispatch = useDispatch();

  const filteredStoresByName = useSelector(
    (state) => state.filteredStoresByName
  );
  const allStores = useSelector((state) => state.filteredStoresByName);
  const posts = useSelector((state) => state.filteredPostsByName);
  const storesRef = useRef(allStores);
  const userData = useSelector((state) => state.userData);

  const [filteredStores, setStores] = useState([]);
  const [postsWithStores, setPostsWithStores] = useState([]);
  console.log(postsWithStores);

  useEffect(() => {
    dispatch(getAllStores());
  }, [dispatch]);

  useEffect(() => {
    let waitingStores;
    if (filteredStoresByName) {
      waitingStores = filteredStoresByName.filter(
        (store) => store.habilitado === "noHabilitado"
      );
    } else {
      waitingStores = allStores.filter(
        (store) => store.habilitado === "noHabilitado"
      );
    }
    setStores(waitingStores);
  }, [dispatch, storesRef]);

  const handleHabilitacion = async (id) => {
    try {
      const response = await axios.post("/tiendas/habStore", { id: id });
      if (response) {
        const storeData = response.data;
        setStores((prevStores) =>
          prevStores.filter((store) => store.id !== id)
        );

        const data = { storeData, userData };
        socket?.emit("approvedStore", data);
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

  useEffect(() => {
    const postsDataWithStores = posts.map((post) => {
      const associatedStore = allStores.find(
        (store) => store.id === post.storeId
      );
      return { ...post, store: associatedStore };
    });
    setPostsWithStores(postsDataWithStores);
  }, [allStores, posts]);

  return (
    <>
      <Head />
      <SearchBar />
      <div className={style.dash}>
        <div className={style.head}>
          <h2>Panel de control</h2>
          <p>Tiendas en espera de aprobacion</p>
        </div>

        <div className={style.stores}>
          {filteredStores.map((store, index) => (
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

        {postsWithStores.length !== 0 && (
          <>
            <div className={style.head}>
              <p>Revision de publicaciones</p>
            </div>

            <div className={style.stores}>
              {postsWithStores.map((post, index) => (
                <div key={index} className={style.storeCard}>
                  <div className={style.title}>
                    <h2>{post.title}</h2>
                  </div>

                  <div className={style.info}>
                    <div className={style.avatar}>
                      <img src={post.image} alt={post.title} />
                    </div>

                    <div className={style.text}>
                      <p>{post.description}</p>
                      <p>Precio: ${post.price}</p>
                      {post.delivery && <p>Cuenta con envío ✅</p>}
                      {!post.delivery && <p>No cuenta con envío ❌</p>}
                      {post.store && (
                        <p>Tienda: {post.store.nombre}</p>
                        // Puedes incluir más información de la tienda si es necesario
                      )}
                    </div>
                  </div>
                  <div className={style.button}>
                    <button>Deshabilitar</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Dashboard;
