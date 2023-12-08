import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { addFavorite, getFavorites, removeFavorite } from "../../redux/actions";

import style from "./CardsStore.module.css";

const CardsStore = ({
  id,
  image,
  nombre,
  horarios,
  calificacion,
  categoria,
}) => {

  const dispatch = useDispatch();
  const userData = useSelector((state) => state.userData)
  const favorites = useSelector((state) => state.favorites);
  const userId = userData?.id
  const storeId = id

  const isStoreFavorite = favorites && favorites.some(favorite => favorite.storeId === storeId);
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
    const isStoreFavorite = favorites.some(favorite => favorite.storeId === storeId);
    setIsFavorite(isStoreFavorite);
  }, [favorites, storeId]);

  useEffect(() => {
    dispatch(getFavorites(userId))
  }, [dispatch])

  return (
    <div className={style.cardsStore}>
      <div className={style.favorite} onClick={toggleFavorite}>
        <img
          src={
            isFavorite
              ? "https://img.icons8.com/ios-glyphs/30/FA5252/like--v1.png"
              : "https://img.icons8.com/ios-glyphs/30/737373/like--v1.png"
          }
          alt="like"
          className={style.fav}
        />
      </div>

      <div key={id} className={style.card}>
        <div className={style.imagen}>
          <img src={image} alt="avatar" />
        </div>

        <div className={style.texto}>
          <h2>{nombre}</h2>
          <h4>{horarios}</h4>
          <h4>Calificación: {calificacion}</h4>
          <h4>{categoria}</h4>
        </div>

        <div className={style.boton}>
          <Link to={`/store/${id}`}>
            <button>Ver</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CardsStore;