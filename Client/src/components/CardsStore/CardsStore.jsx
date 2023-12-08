
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom";
import { addFavorite, removeFavorite } from "../../redux/actions"

import avatar from "../../assets/storeAvatar.jpg";
import style from "./CardsStore.module.css";


const CardsStore = ({userData}) => {
  const dispatch = useDispatch();
  const [isFavorite, setIsFavorite] = useState(false);
  const stores = useSelector((state) => state.allStores)
  console.log(stores);
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

       {stores.map((store) => (
        <div key={store.id} className={style.card}>
          <div className={style.imagen}>
            <img src={store.image} alt="avatar" />
          </div>

          <div className={style.texto}>
            <h2>{store.nombre}</h2>
            <h4>Dias de atención y horarios: {store.horarios}</h4>
            <h4>Calificación: {store.calificacion}</h4>
            <h4>Categoría: {store.categoria}</h4>
          </div>

          <div className={style.boton}>
            <Link to={`/store/${store.id}`}>
              <button>Ver</button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardsStore;
