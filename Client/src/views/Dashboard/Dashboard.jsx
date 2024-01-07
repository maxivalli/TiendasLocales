import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import style from "./Dashboard.module.css";
import {
  getAllCompras,
  getAllStores,
  getDisabledStores,
} from "../../redux/actions";
import axios from "axios";
import Swal from "sweetalert2";
import { socket } from "../../App";
import Head from "../../components/Head/Head";
import SearchBar from "../../components/SearchBar/SearchBar";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const allUsers = useSelector((state) => state.allUsers);
  const storesByName = useSelector((state) => state.filteredStoresByName);
  const disabledStores = useSelector((state) => state.disabledStores);
  const allStores = useSelector((state) => state.allStoresCopy);
  const posts = useSelector((state) => state.filteredPostsByName);
  const allPosts = useSelector((state) => state.allPosts);
  const userData = useSelector((state) => state.userData);
  const allCompras = useSelector((state) => state.allCompras);

  const [filteredStores, setStores] = useState([]);
  const [habilitedStores, setHabilitedStores] = useState([]);
  const [postsWithStores, setPostsWithStores] = useState([]);
  const [waitingStores, setWaitingStores] = useState([]);
  const [actualizar, setActualizar] = useState();

  useEffect(() => {
    if (userData && userData.rol !== "admin") {
      navigate("/");
    }
  }, [userData]);

  useEffect(() => {
    let habilitedStores;
    if (storesByName.length !== 0) {
      habilitedStores =
        storesByName &&
        storesByName.filter((store) => store.habilitado === "habilitado");
    }
    setHabilitedStores(habilitedStores);
  }, [dispatch, storesByName, actualizar]);

  //CANTIDAD DE USUARIOS REGISTRADOS EN TOTAL
  const cantidadUsuarios = allUsers.length;

  //CANTIDAD DE USUARIOS QUE SE REGISTRARON EN EL ULTIMO MES
  const registrosUltimoMes = () => {
    const fechaActual = new Date();
    const fechaHaceUnMes = new Date();
    fechaHaceUnMes.setMonth(fechaActual.getMonth() - 1);
    const usuariosNuevos = allUsers.filter(
      (usuario) => new Date(usuario.createdAt) >= fechaHaceUnMes
    );
    return usuariosNuevos.length;
  };

  //CANTIDAD DE TIENDAS REGISTRADAS EN TOTAL
  const cantidadTiendas = allStores.length;

  //CANTIDAD DE PUBLICACIONES REGISTRADAS EN TOTAL
  const cantidadPublicaciones = allPosts.length;

  //CANTIDAD DE COMPRAS REGISTRADAS EN TOTAL
  const cantidadCompras = allCompras.length;

  //CANTIDAD DE COMPRAS QUE SE REGISTRARON EN EL ULTIMO MES
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
    dispatch(getDisabledStores());
    dispatch(getAllStores()).then(() => {
      setWaitingStores(false);
    });
    dispatch(getAllCompras());
  }, [dispatch, actualizar]);

  useEffect(() => {
    let waitingStores;
    if (storesByName.length !== 0) {
      waitingStores = storesByName.filter(
        (store) => store.habilitado === "noHabilitado"
      );
    } else {
      waitingStores =
        allStores &&
        allStores.filter((store) => store.habilitado === "noHabilitado");
    }
    setStores(waitingStores);
  }, [waitingStores]);

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
          text: "¡La tienda fue aprobada, se mandara un mail al usuario!",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeshabilitarStore = async (storeId) => {
    try {
      const response = await axios.post("/tiendas/desStore", { storeId });
      if (response) {
        setHabilitedStores((prevStores) =>
          prevStores.filter((store) => store.id !== storeId)
        );

        Swal.fire({
          icon: "success",
          title: `Tienda Deshabilitada!`,
          text: "¡La tienda fue deshabilitada con exito!",
        }).then(() => {
          setTimeout(() => {
            dispatch(getDisabledStores());
          });
        }, 1200);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleHabilitarStore = async (storeId) => {
    try {
      const response = await axios.post("/tiendas/habilitarStore", { storeId });
      if (response) {
        userData && dispatch(getUserStore(userData?.id));
        setActualizar(false);
        Swal.fire({
          icon: "success",
          title: `¡Tienda habilitada!`,
          text: "La tienda fue habilitada con exito",
        }).then(() => {
          setActualizar(true);
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const postsDataWithStores =
      posts &&
      posts.map((post) => {
        const associatedStore = allStores.find(
          (store) => store.id === post.storeId
        );
        return { ...post, store: associatedStore };
      });
    setPostsWithStores(postsDataWithStores);
  }, [allStores, posts, actualizar]);

  const [mensaje, setMensaje] = useState({
    titulo: "",
    texto: "",
  });

  const [error, setError] = useState({
    titulo: "",
    texto: "",
  });

  const validateTitulo = (titulo) => {
    if (titulo === "" && titulo === null) {
      return "Debes completar el campo";
    }
    if (titulo.length > 30) {
      return `Titulo demasiado largo (${titulo.length} de 30)`;
    }
    return null;
  };

  const validatetexto = (texto) => {
    if (texto === "" && texto === null) {
      return "Debes completar el campo";
    } else if (texto.length > 80) {
      return `Mensaje demasiado largo (${texto.length} de 80)`;
    } else if (texto.length <= 5) {
      return "Mensaje demasiado corto";
    }
    return null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMensaje({
      ...mensaje,
      [name]: value,
    });
    if (name === "titulo") {
      setError({ ...error, titulo: validateTitulo(value) });
    } else if (name === "texto") {
      setError({
        ...error,
        texto: validatetexto(value, mensaje.texto),
      });
    }
  };

  function isSubmitDisabled() {
    return Object.values(error).some((error) => error !== null);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (error.titulo || error.texto) {
      return;
    }

    const data = { titulo: mensaje.titulo, texto: mensaje.texto };
    socket?.emit("mensajeGeneral", data);
    setMensaje({
      titulo: "",
      texto: "",
    });

    Swal.fire({
      icon: "success",
      title: `¡Notificación enviada!`,
      text: "Su mensaje fue enviado con éxito a todos los usuarios",
    });
  };

  return (
    <>
      <Head />
      <SearchBar />
      <div className={style.dash}>
        <div className={style.head}>
          <h2>Panel de control</h2>

          <div className={style.container}>
            <div className={style.title}>
              <h2>Enviar notificacion general</h2>
            </div>

            <div className={style.form}>
              <form onSubmit={handleSubmit}>
                <div className={style.sI}>
                  <div className={style.titulo}>
                    <p>Título:</p>
                    <input
                      type="text"
                      id="titulo"
                      name="titulo"
                      value={mensaje.titulo}
                      onChange={handleChange}
                      placeholder="Inserte un breve titulo"
                      required
                    />
                    {error.titulo && (
                      <span className={style.error}>{error.titulo}</span>
                    )}
                  </div>

                  <div className={style.mensaje}>
                    <p>Mensaje:</p>
                    <textarea
                      id="texto"
                      name="texto"
                      value={mensaje.texto}
                      onChange={handleChange}
                      placeholder="Inserte un breve mensaje"
                      required
                    />
                    {error.texto && (
                      <span className={style.error}>{error.texto}</span>
                    )}
                  </div>
                </div>
                <div>
                  <button
                    className={
                      isSubmitDisabled()
                        ? `${style.register} ${style.buttonDisabled}`
                        : style.register
                    }
                    disabled={isSubmitDisabled()}
                    type="submit"
                  >
                    Enviar
                  </button>
                </div>
              </form>
            </div>
          </div>
          <h2>Tiendas para habilitar</h2>
        </div>

        <div className={style.stores}>
          {filteredStores.map((store, index) => (
            <div key={index} className={style.storeCard}>
              <div className={style.avatar}>
                <img src={store.image} alt={store.nombre} />
              </div>

              <div className={style.text}>
                <h2>{store.nombre}</h2>
                <p>📬 {store.email}</p>
                <p>
                  📍 {store.direccion.calle} {store.direccion.numero} (piso:{" "}
                  {store.direccion.piso} local: {store.direccion.depto})
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

        {habilitedStores && habilitedStores.length !== 0 && (
          <>
            <div className={style.head}>
              <h2>Revision de tiendas</h2>
            </div>

            <div className={style.stores}>
              {habilitedStores.map((store, index) => (
                <div key={index} className={style.storeCard}>
                  <Link to={`/tienda/${store.nombre}`}>
                    <div className={style.avatar}>
                      <img src={store.image} alt={store.nombre} />
                    </div>
                  </Link>
                  <div className={style.text}>
                    <h2>{store.nombre}</h2>
                    <p>✉️ {store.email}</p>
                    <p>
                      📍 {store.direccion.calle} {store.direccion.numero} (piso:{" "}
                      {store.direccion.piso} local: {store.direccion.depto})
                    </p>
                    <p>{store.categoria}</p>
                  </div>

                  <div className={style.button}>
                    <button onClick={() => handleDeshabilitarStore(store.id)}>
                      Deshabilitar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {disabledStores.length !== 0 && (
          <>
            <div className={style.head}>
              <h2>Tiendas deshabilitadas</h2>
            </div>

            <div className={style.stores}>
              {disabledStores.map((store, index) => (
                <div key={index} className={style.storeCard}>
                  <div className={style.avatar}>
                    <img src={store.image} alt={store.nombre} />
                  </div>

                  <div className={style.text}>
                    <h2>{store.nombre}</h2>
                    <p>📬 {store.email}</p>
                    <p>
                      📍 {store.direccion.calle} {store.direccion.numero} (piso:{" "}
                      {store.direccion.piso} local: {store.direccion.depto})
                    </p>
                    <p>{store.categoria}</p>
                  </div>

                  <div className={style.button}>
                    <button onClick={() => handleHabilitarStore(store.id)}>
                      Habilitar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {postsWithStores.length !== 0 && (
          <>
            <div className={style.head}>
              <h2>Revision de publicaciones</h2>
            </div>

            <div className={style.stores}>
              {postsWithStores.map((post, index) => (
                <div key={index} className={style.storeCard}>
                  <Link to={`/post/${post.id}`}>
                    <div className={style.avatar}>
                      <img src={post.image} alt={post.title} />
                    </div>
                  </Link>
                  <div className={style.info}>
                    <div className={style.text}>
                      <h2>{post.title}</h2>
                      {post.store && (
                        <>
                          <p>🏪 "{post.store.nombre}"</p>
                          <p>✉️ {post.store.email}</p>
                        </>
                      )}
                      {post.delivery && <p>✅ Cuenta con envío</p>}
                      {!post.delivery && <p>❌ No cuenta con envío</p>}
                      <h3>${post.price}</h3>
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
