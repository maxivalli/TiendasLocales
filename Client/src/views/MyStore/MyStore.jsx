import React, { useEffect, useState } from "react";
import CardSquare from "../../components/CardSquare/CardSquare";
import Filters from "../../components/Filters/Filters";
import Head from "../../components/Head/Head";
import OptButtons from "../../components/OptButtons/ObtButtons";
import { Link } from "react-router-dom";
import style from "./MyStore.module.css";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getStorePosts, setSelectedStore } from "../../redux/actions";
import isStoreOpen from "../../components/isStoreOpen/isStoreOpen";
import axios from "axios";
import Swal from "sweetalert2";
import CardWide from "../../components/CardWide/CardWide";

const MyStore = () => {
  const dispatch = useDispatch();
  const { storeId } = useParams();
  const userData = useSelector((state) => state.userData);
  const stores = useSelector((state) => state.allStores);
  const storePosts = useSelector((state) => state.storePosts);
  const allPosts = useSelector((state) => state.allPosts);
  const selectedStore = stores.find((store) => store.id == storeId);
  const [comprasData, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(setSelectedStore(selectedStore))
    dispatch(getStorePosts(storeId))
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching store posts:", error);
        setLoading(false);
      });

    const fetchData = async () => {
      try {
        const response = await axios.get(`/tiendas/pedidosCompras/${storeId}`);
        if (response) {
          setCompras(response.data);
          console.log(comprasData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [dispatch, storeId, allPosts]);

  const handleConnectMP = () => {
    window.open(
      `https://auth.mercadopago.com/authorization?client_id=6356168129471214&response_type=code&platform_id=mp&state=${userData.id}&redirect_uri=https://tiendaslocales-production.up.railway.app/tiendas/redirectUrl`
    );

    window.location.href = `/#/mitienda/${storeId}`;

    Swal.fire({
      icon: "success",
      title: "¡Tienda conectada a Mercado Pago!",
      text: "Ahora debes recargar la página",
    });
  };

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
            <img src={selectedStore?.image} alt="avatar" />
            <div className={style.info2}>
            {selectedStore?.averageRating ? (
                <div>
                  {Array.from(
                    { length: selectedStore?.averageRating },
                    (_, index) => (
                      <span key={index}>⭐️</span>
                    )
                  )}
                </div>
              ) : (
                <p>Aún no tienes calificaciones</p>
              )}
            </div>
          </div>

          <div className={style.info}>
            <h2>{selectedStore?.nombre}</h2>
            <p>
              {" "}
              <span
                style={{
                  color: isStoreOpen(
                    selectedStore?.dias,
                    selectedStore?.horarios
                  )
                    ? "cornflowerblue"
                    : "red",
                }}
              >
                {isStoreOpen(selectedStore?.dias, selectedStore?.horarios)
                  ? "✅ Abierto"
                  : "❗️ Cerrado"}
              </span>
            </p>
            <p>
              📍 {selectedStore?.direccion.calle}{" "}
              {selectedStore?.direccion.numero} (piso:{" "}
              {selectedStore?.direccion.piso} local:{" "}
              {selectedStore?.direccion.depto})
            </p>
            <p>📆 {selectedStore?.dias}</p>
            <p>
              ⏰ {selectedStore?.horarios.horario_de_apertura}hs a{" "}
              {selectedStore?.horarios.horario_de_cierre}hs
              {selectedStore?.horarios.horario_de_apertura2 &&
                selectedStore?.horarios.horario_de_cierre2 && (
                  <>
                    {" y "}
                    {selectedStore?.horarios.horario_de_apertura2}hs a{" "}
                    {selectedStore?.horarios.horario_de_cierre2}hs
                  </>
                )}
            </p>
            <p>{selectedStore?.categoria}</p>
          </div>
        </div>
        {!userData.accT && (
          <div className={style.buttonMP}>
            <div className={style.MP}>
              <div className={style.modal}>
                <p>
                  Para publicar productos con la opcion de compra primero
                  necesitas conectar tu cuenta de Mercado Pago para poder
                  recibir el dinero.
                </p>
              </div>

              <CardWide
                Fn={handleConnectMP}
                textButton={"Conectar MP"}
                logo={
                  <img
                    width="60"
                    height="60"
                    src="https://img.icons8.com/color/96/mercado-pago.png"
                    alt="mercado-pago"
                  />
                }
              />
            </div>
          </div>
        )}
        <Link to="/agregarproducto">
          <div className={style.agregar}>
            <button>Agregar</button>
          </div>
        </Link>
        <div className={style.title}>
          <h2>Productos disponibles</h2>
        </div>

        <div className={style.store2}>
          {storePosts.map((post, index) => (
            <CardSquare key={index} {...post} storeId={storeId} />
          ))}
        </div>
        <OptButtons storeId={storeId} />
      </div>
    </>
  );
};

export default MyStore;
