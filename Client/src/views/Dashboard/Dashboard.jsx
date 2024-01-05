import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import style from "./Dashboard.module.css";
import { getAllCompras, getAllStores } from "../../redux/actions";
import axios from "axios";
import Swal from "sweetalert2";
import { socket } from "../../App";
import Head from "../../components/Head/Head";
import SearchBar from "../../components/SearchBar/SearchBar";

const Dashboard = () => {
  const dispatch = useDispatch();

  const allUsers = useSelector((state) => state.allUsers);
  const storesByName = useSelector((state) => state.filteredStoresByName);
  const allStores = useSelector((state) => state.filteredStoresByName);
  const posts = useSelector((state) => state.filteredPostsByName);
  const allPosts = useSelector((state) => state.allPosts);
  const storesRef = useRef(allStores);
  const userData = useSelector((state) => state.userData);
  const allCompras = useSelector((state) => state.allCompras);

  const [filteredStores, setStores] = useState([]);
  const [postsWithStores, setPostsWithStores] = useState([]);

  //CANTIDAD DE USUARIOS REGISTRADOS EN TOTAL
  const cantidadUsuarios = allUsers.length;

  //CANTIDAD DE USUARIOS QUE SE REGISTRARON EN EL ULTIMO MES
  const registrosUltimoMes = () => {
    const fechaActual = new Date();
    const fechaHaceUnMes = new Date();
    fechaHaceUnMes.setMonth(fechaActual.getMonth() - 1);

    // Filtrar usuarios registrados en el último mes
    const usuariosNuevos = allUsers.filter(
      (usuario) => new Date(usuario.createdAt) >= fechaHaceUnMes
    );
    return usuariosNuevos.length;
  };

  //CANTIDAD DE TIENDAS REGISTRADAS EN TOTAL
  const cantidadTiendas = allStores.length;

  //CANTIDAD DE PUBLICACIONES REGISTRADAS EN TOTAL
  const cantidadPublicaciones = allPosts.length;

  //CANTIDAD DE PUBLICACIONES REGISTRADAS EN TOTAL
  const cantidadCompras = allCompras.length;

  //CANTIDAD DE USUARIOS QUE SE REGISTRARON EN EL ULTIMO MES
  const comprasUltimoMes = () => {
    const fechaActual = new Date();
    const fechaHaceUnMes = new Date();

    fechaHaceUnMes.setMonth(fechaActual.getMonth() - 1);

    const ComprasUltimoMes = allCompras.filter(
      (compra) => new Date(compra.createdAt) >= fechaHaceUnMes
    );
    return ComprasUltimoMes.length;
  };

  useEffect(() => {
    dispatch(getAllStores());
    dispatch(getAllCompras());
  }, [dispatch]);

  useEffect(() => {
    let waitingStores;
    if (storesByName) {
      waitingStores = storesByName.filter(
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
                        <>
                          <p>Tienda: {post.store.nombre}</p>
                          <p>Email de tienda: {post.store.email}</p>
                        </>
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
