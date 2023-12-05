
import { useState } from "react";
import { useDispatch } from "react-redux"
import { Link } from "react-router-dom";
import { addFavorite, removeFavorite } from "../../redux/actions"

import avatar from "../../assets/storeAvatar.jpg";
import favoriteIcon from "../../assets/favoritazo.gif";
import noFavoriteIcon from "../../assets/noFavorito.png";
import addToFavoriteIcon from "../../assets/agregarFavorito.gif";
import style from "./CardsStore.module.css";


const CardsStore = ({userData}) => {
  console.log(userData, "Esto en CARDSTORE");
  const dispatch = useDispatch();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  //const userId = userData.id

  const handleFavoriteClick = () => {
    if (isFavorite) {
      setIsFavorite(false);
      dispatch(removeFavorite(userId))
    } else {
      setIsFavorite(true);
      dispatch(addFavorite(userId))
    }
  };

  const handleMouseOver = () => {
    setIsHovered(true);
  };

  const handleMouseOut = () => {
    setIsHovered(false);
  };

  return (
    <div className={style.cardsStore}>

      {isFavorite ? (
        <img
          src={favoriteIcon}
          alt="like"
          className={style.fav}
          onClick={handleFavoriteClick}
        />
      ) : (
        <img
          src={isHovered ? addToFavoriteIcon : noFavoriteIcon}
          alt="like"
          className={style.fav}
          onClick={handleFavoriteClick}
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
        />
      )}
          <div className={style.imagen} >
        <img src={avatar} alt="avatar"/>
      </div>

      <div className={style.texto}>
        <h2>Pizza Land</h2>
        <h4>8:00 a 20:00</h4>
        <h4>Calificación</h4>
        <h4>Categoría</h4>
      </div>

      <div className={style.boton}>
        <Link to="/store">
          <button>Ver</button>
        </Link>
      </div>

    </div>
  );
};

export default CardsStore;
