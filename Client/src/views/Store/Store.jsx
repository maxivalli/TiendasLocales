import React, { useEffect, useState } from "react";
import axios from "axios";
import CardSquare from "../../components/CardSquare/CardSquare";
import Filters from "../../components/Filters/Filters";
import Head from "../../components/Head/Head";
import NavButtons from "../../components/NavButtons/NavButtons";
import style from "./Store.module.css";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getStorePosts, setSelectedStore } from "../../redux/actions";
import isStoreOpen from "../../components/isStoreOpen/isStoreOpen";

const Store = ({ userData }) => {
  const dispatch = useDispatch();
  const { linkName } = useParams();
  const stores = useSelector((state) => state.allStores);
  const storePosts = useSelector((state) => state.storePosts);
  const storeName = linkName.replace(/-/g, " ");
  const selectedStore = stores.find((store) => store.nombre === storeName);
  const storeId = selectedStore?.id;

  const [loading, setLoading] = useState(true);
  const [alreadyReview, setAlredyReview] = useState(false);

  useEffect(() => {
    async function fetchData() {
    try {
      const response = await axios.get(
        `/reviews/${userData.id}/${selectedStore.userId}`
      );
      if (response) {
        setAlredyReview(true);
      }
    } catch (error) {
      throw error;
    }
  }
    fetchData()
    }, [alreadyReview]);


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
  }, [dispatch, storeId, alreadyReview]);

  const handleRating = async (value) => {
    try {
      let newReview = {
        userId: userData.id,
        reviewedUserId: selectedStore.userId,
        rating: value,
      };

      const newRating = await axios.post("/reviews/postReview", newReview);

      if (newRating) {
        setAlredyReview(true);
        let usuarioId = newRating.data.reviewedUserId
        
        const response = await axios.get("/reviews/getAverageRating", {
          params: {
            usuarioId: usuarioId
          }
        });

        if (response) {
          selectedStore.averageRating = response.data;
        }
      }
    } catch (error) {
      console.log(error);
    }
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

            <img src={selectedStore.image} alt="avatar" />
            <div className={style.info2}>
              {selectedStore.averageRating && (
                <div>
                  {Array.from(
                    { length: selectedStore.averageRating },
                    (_, index) => (
                      <span key={index}>⭐️</span>
                    )
                  )}
                </div>)}
          
                  {alreadyReview ? 
                    <p>¡Ya calificaste esta tienda!</p>
                     : 
                   (<>
                      <div>
                        <div className={style.rating}>
                          <p>Calificá esta tienda:</p>
                          {[1, 2, 3, 4, 5].map((value) => (
                            <label key={value}>
                              <input
                                type="radio"
                                name="rating"
                                value={value}
                                onClick={() => handleRating(value)}
                              />
                              {value}
                            </label>
                          ))}
                        </div>
                      </div>
                    </>)
                    }
            </div>
          </div>

          <div className={style.info}>
            <h2>{selectedStore.nombre}</h2>
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
              📍 {selectedStore.direccion.calle}{" "}
              {selectedStore.direccion.numero} (piso:{" "}
              {selectedStore.direccion.piso} local:{" "}
              {selectedStore.direccion.depto})
            </p>
            <p>📆 {selectedStore.dias}</p>
            <p>
              ⏰ {selectedStore.horarios.horario_de_apertura}hs a{" "}
              {selectedStore.horarios.horario_de_cierre}hs
              {selectedStore.horarios.horario_de_apertura2 &&
                selectedStore.horarios.horario_de_cierre2 && (
                  <>
                    {" y "}
                    {selectedStore.horarios.horario_de_apertura2}hs a{" "}
                    {selectedStore.horarios.horario_de_cierre2}hs
                  </>
                )}
            </p>

            <p>{selectedStore.categoria}</p>
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
