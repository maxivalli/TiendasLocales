import React, { useEffect, useState } from "react";
import axios from "axios";
import CardSquare from "../../components/CardSquare/CardSquare";
import Filters from "../../components/Filters/Filters";
import Head from "../../components/Head/Head";
import Spinner from "../../components/Spinner/Spinner";
import NavButtons from "../../components/NavButtons/NavButtons";
import likeG from "../../assets/likeG.png";
import likeR from "../../assets/likeR.png";
import style from "./Store.module.css";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addFavorite,
  getAllStores,
  getFavorites,
  getStorePosts,
  isStoreOpenSwitch,
  removeFavorite,
  setSelectedStore,
} from "../../redux/actions";
import isStoreOpen from "../../components/isStoreOpen/isStoreOpen";
import ReactPaginate from "react-paginate";

const Store = () => {
  const dispatch = useDispatch();
  const { linkName } = useParams();

  const userData = useSelector((state) => state.userData);
  const stores = useSelector((state) => state.allStoresCopy);
  const storePosts = useSelector((state) => state.storePosts);
  const favorites = useSelector((state) => state.favorites);

  const [loading, setLoading] = useState(true);
  const [alreadyReview, setAlreadyReview] = useState(false);
  const [filteredPostsPaginado, setFilteredPosts] = useState([]);
  const [postPage, setPostPage] = useState(1);
  const postsPerPage = 12;

  const storeName = linkName.replace(/-/g, " ");
  const selectedStore =
    stores && stores.find((store) => store.nombre === storeName);
  const storeId = selectedStore?.id;
  const userId = selectedStore?.userId;

  useEffect(() => {
    async function fetchData() {
      if (userId && userData && userData.id) {
        const response = await axios.get(`/reviews/${userData.id}/${userId}`);
        if (response.data) {
          setAlreadyReview(true);
        }
      }
    }

    if (userId && userData && userData.id) {
      fetchData();
    }
  }, [userId, userData]);

  useEffect(() => {
    dispatch(setSelectedStore(selectedStore));
    storeId && dispatch(getStorePosts(storeId));
    userId && dispatch(getFavorites(userId));
    dispatch(getAllStores()).then(() => {
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
        setAlreadyReview(true);
        let usuarioId = newRating.data.reviewedUserId;
        const response = await axios.get("/reviews/getAverageRating", {
          params: {
            usuarioId: usuarioId,
          },
        });
        if (response) {
          selectedStore.averageRating = response.data;
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    storeId &&
      dispatch(
        isStoreOpenSwitch(
          isStoreOpen(selectedStore?.dias, selectedStore?.horarios),
          storeId
        )
      );
  }, [stores]);

  const isStoreFavorite =
    favorites &&
    favorites.some(
      (favorite) => favorite.storeId === storeId && favorite.postId === null
    );
  const [isFavorite, setIsFavorite] = useState(isStoreFavorite);

  const toggleFavorite = () => {
    if (isFavorite) {
      setIsFavorite(false);
      dispatch(removeFavorite(userId, storeId));
    } else {
      setIsFavorite(true);
      dispatch(addFavorite(userId, storeId));
    }
  };

  useEffect(() => {
    const isStoreFavorite = favorites.some(
      (favorite) => favorite.storeId === storeId && favorite.postId === null
    );
    setIsFavorite(isStoreFavorite);
  }, [favorites, storeId]);

  useEffect(() => {
    const storedPosts = JSON.parse(localStorage.getItem("posts")) || [];
    if (storedPosts.length > 0) {
      setFilteredPosts(storedPosts);
    }
    setTimeout(() => {
      setLoading(false);
    }, 750);
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
    return <Spinner />;
  }

  return (
    <>
      <Filters />
      <Head />
      <div className={style.viewStore}>
        <div className={style.store}>
          <div className={style.avatar}>
            <img src={selectedStore?.image} alt="avatar" />
            {selectedStore?.averageRating && (
              <div className={style.stars}>
                {Array.from(
                  { length: selectedStore?.averageRating },
                  (_, index) => (
                    <span key={index}>⭐️</span>
                  )
                )}
              </div>
            )}
            <div className={style.info2}>
              {alreadyReview ? (
                <p>¡Ya calificaste esta tienda!</p>
              ) : (
                <>
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
                </>
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
                    selectedStore?.horarios,
                    storeId
                  )
                    ? "cornflowerblue"
                    : "red",
                }}
              >
                {isStoreOpen(
                  selectedStore?.dias,
                  selectedStore?.horarios,
                  storeId
                )
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
          <div className={style.favorite} onClick={toggleFavorite}>
            <img
              src={isFavorite ? likeR : likeG}
              alt="like"
              className={style.fav}
            />
          </div>
        </div>

        <div className={style.title}>
          <h2>Productos disponibles</h2>
        </div>

        <div className={style.store2}>
          {filteredPostsPaginado &&
            filteredPostsPaginado.map((post, index) => (
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
        <div className={style.buttons}>
          <NavButtons storeId={storeId} />
        </div>
      </div>
    </>
  );
};

export default Store;
