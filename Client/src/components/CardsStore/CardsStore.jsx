import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { addFavorite, getFavorites, removeFavorite } from "../../redux/actions";
import { socket } from "../../App";
import likeG from "../../assets/likeG.png";
import likeR from "../../assets/likeR.png";
import style from "./CardsStore.module.css";
import isStoreOpen from "../isStoreOpen/isStoreOpen";

const CardsStore = ({
  id,
  image,
  nombre,
  horarios,
  averageRating,
  categoria,
  dias,
}) => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.userData);
  const favorites = useSelector((state) => state.favorites);
  const userId = userData?.id;
  const storeId = id;
  const linkName = nombre.replace(/\s/g, "-");

  const isStoreFavorite =
    favorites &&
    favorites.some(
      (favorite) => favorite.storeId === storeId && favorite.postId === null
    );
  const [isFavorite, setIsFavorite] = useState(isStoreFavorite);

  const toggleFavorite = () => {
    const addText = `¡Se ha agregado "${nombre}" a favoritos!`;
    const addData = { userId, storeId, addText, image, userData };
    if (isFavorite) {
      setIsFavorite(false);
      dispatch(removeFavorite(userId, storeId));
      // socket.emit("removeFavorite", data);
    } else {
      setIsFavorite(true);
      dispatch(addFavorite(userId, storeId));
      socket.emit("addFavorite", addData);
    }
  };

  useEffect(() => {
    const isStoreFavorite = favorites.some(
      (favorite) => favorite.storeId === storeId && favorite.postId === null
    );
    setIsFavorite(isStoreFavorite);
  }, [favorites, storeId]);

  useEffect(() => {
    if (userId !== undefined) {
      dispatch(getFavorites(userId));
    }
  }, [userId]);

  return (
    <div className={style.cardsStore}>
      <div className={style.favorite} onClick={toggleFavorite}>
        <img
          src={isFavorite ? likeR : likeG}
          alt="like"
          className={style.fav}
        />
      </div>

      <Link to={`/tienda/${linkName}`}>
        <div className={style.imagen}>
          <img src={image} alt="avatar" />
        </div>
        <div className={style.texto}>
          <h2>{nombre}</h2>
          <h5
            style={{
              color: isStoreOpen(dias, horarios) ? "cornflowerblue" : "red",
            }}
          >
            {isStoreOpen(dias, horarios) ? "✅ Abierto" : "❗️ Cerrado"}
          </h5>
          <h4>📆 {dias}</h4>
          <h4>
            ⏰ {horarios.horario_de_apertura}hs a {horarios.horario_de_cierre}hs
          </h4>

          {horarios.horario_de_apertura2 && horarios.horario_de_cierre2 && (
            <>
              <h4>
                {horarios.horario_de_apertura2}hs a{" "}
                {horarios.horario_de_cierre2}hs
              </h4>
            </>
          )}

          {averageRating ? (
            <>
              {Array.from({ length: averageRating }, (_, index) => (
                <span key={index}>⭐️</span>
              ))}
            </>
          ) : (
            <h4>Sin calificaciones</h4>
          )}
          <h4>{categoria}</h4>
        </div>
      </Link>
    </div>
  );
};

export default CardsStore;
