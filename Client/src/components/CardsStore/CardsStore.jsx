
import { useState } from "react";
import { useDispatch } from "react-redux"
import { Link } from "react-router-dom";
import { addFavorite, removeFavorite } from "../../redux/actions"

import avatar from "../../assets/storeAvatar.jpg";
import style from "./CardsStore.module.css";


const CardsStore = ({userData}) => {
  const dispatch = useDispatch();
  const [isFavorite, setIsFavorite] = useState(false);

  const userId = userData?.id

  const toggleFavorite = () => {
    if (isFavorite) {
      setIsFavorite(false);
      dispatch(removeFavorite(userId))
    } else {
      setIsFavorite(true);
      dispatch(addFavorite(userId))
    }
  };

  return (
    <div className={style.cardsStore}>

      <div className={style.favorite} onClick={toggleFavorite}>
      <img 
          src={isFavorite ? "https://img.icons8.com/ios-glyphs/30/FA5252/like--v1.png" : "https://img.icons8.com/ios-glyphs/30/737373/like--v1.png"} 
          alt="like" 
          className={style.fav}
        />
      </div>

      <div className={style.imagen}>
        <img src={avatar} alt="avatar" />
      </div>

      <div className={style.texto}>
        <h2>Pizza Land</h2>
        <h4>8:00 a 20:00</h4>
        <h4>Calification</h4>
        <h4>Categoria</h4>
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
