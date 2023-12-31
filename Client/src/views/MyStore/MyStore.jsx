import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import CardSquare from "../../components/CardSquare/CardSquare";
import Filters from "../../components/Filters/Filters";
import Spinner from '../../components/Spinner/Spinner'
import Head from "../../components/Head/Head";
import OptButtons from "../../components/OptButtons/ObtButtons";
import { Link, useNavigate } from "react-router-dom";
import style from "./MyStore.module.css";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getComprasRecibidas,
  getStorePosts,
  isStoreOpenSwitch,
  setSelectedStore,
} from "../../redux/actions";
import isStoreOpen from "../../components/isStoreOpen/isStoreOpen";
import Swal from "sweetalert2";
import CardWide from "../../components/CardWide/CardWide";
import mPago from "../../assets/mPago.png";

const MyStore = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { storeId } = useParams();

  const userData = useSelector((state) => state.userData);
  const stores = useSelector((state) => state.allStoresCopy);
  const storePosts = useSelector((state) => state.storePosts);
  const allPostsCopy = useSelector((state) => state.allPostsCopy);

  const [loading, setLoading] = useState(true);
  const [filteredPostsPaginado, setFilteredPosts] = useState([]);
  const [postPage, setPostPage] = useState(1);
  const postsPerPage = 12;

  const selectedStore = stores && stores.find((store) => store.id == storeId);
  const userStore = stores.find((store) => store.userId === userData.id);


  useEffect(() => {
    dispatch(setSelectedStore(selectedStore));
    dispatch(getComprasRecibidas(storeId));
    dispatch(getStorePosts(storeId))
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching store posts:", error);
        setLoading(false);
      });
  }, [dispatch, storeId, allPostsCopy]);

  const handleConnectMP = () => {
    window.open(
      `https://auth.mercadopago.com/authorization?client_id=6356168129471214&response_type=code&platform_id=mp&state=${userData.id}&redirect_uri=https://tiendaslocales-production.up.railway.app/tiendas/redirectUrl`
    );

    Swal.fire({
      icon: "success",
      title: "¡Tienda conectada a Mercado Pago!",
      text: "Si el mensaje se sigue mostrando recarga la página",
    }).then(() => {
      window.location.reload();
    });
  };

  useEffect(() => {
    if (userStore && storeId != userStore?.id) {
      navigate("/");
    }
  }, [selectedStore]);

  useEffect(() => {
    dispatch(
      isStoreOpenSwitch(
        isStoreOpen(selectedStore?.dias, selectedStore?.horarios),
        storeId
      )
    );
  }, [dispatch]);

  useEffect(() => {
    const startPostIndex = (postPage - 1) * postsPerPage;
    const endPostIndex = startPostIndex + postsPerPage;
    setFilteredPosts(storePosts.slice(startPostIndex, endPostIndex));
    localStorage.setItem("storePosts", JSON.stringify(storePosts));
  }, [storePosts, postPage]);

  const handlePostPageClick = (data) => {
    setPostPage(data.selected + 1);
  };

  if (loading) {
    return (
      <Spinner/>
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
              {selectedStore?.direccion.numero}
              {selectedStore?.direccion.piso && (
                <> (piso: {selectedStore?.direccion.piso})</>
              )}
              {selectedStore?.direccion.depto && (
                <> (local: {selectedStore?.direccion.depto})</>
              )}
            </p>
            <p>📆 {selectedStore?.dias}</p>
            <p>
              ⏰ {selectedStore?.horarios?.horario_de_apertura}hs a{" "}
              {selectedStore?.horarios?.horario_de_cierre}hs
              {selectedStore?.horarios?.horario_de_apertura2 &&
                selectedStore?.horarios?.horario_de_cierre2 && (
                  <>
                    {" y "}
                    {selectedStore?.horarios?.horario_de_apertura2}hs a{" "}
                    {selectedStore?.horarios?.horario_de_cierre2}hs
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
                  <img width="60" height="60" src={mPago} alt="mercado-pago" />
                }
              />
            </div>
          </div>
        )}
        <Link to="/agregarproducto">
          <div className={style.agregar}>
            <button>Agregar un producto</button>
          </div>
        </Link>
        <div className={style.title}>
          <h2>Productos disponibles</h2>
        </div>

        <div className={style.store2}>
          {filteredPostsPaginado.map((post, index) => (
            <CardSquare key={index} {...post} storeId={storeId} />
          ))}
        </div>
        {storePosts.length > postsPerPage && (
          <ReactPaginate
            pageCount={Math.ceil(storePosts.length / postsPerPage)}
            pageRangeDisplayed={2}
            marginPagesDisplayed={1}
            onPageChange={handlePostPageClick}
            containerClassName={style.pagination}
            activeClassName={style.active}
            nextLabel="▶️"
            previousLabel="◀️"
          />
        )}
        <div className={style.margin}></div>
        <OptButtons storeId={storeId} />
      </div>
    </>
  );
};

export default MyStore;
