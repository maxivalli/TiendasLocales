import React, { useState } from "react";
import {Link} from 'react-router-dom'
import style from "./CardSquare.module.css";
import { useSelector } from "react-redux";

const CardSquare = ({id, title, marca, description, price, stock, delivery, image, storeId}) => {
  
  const stores = useSelector((state) => state.allStores);
  const [isFavorite, setIsFavorite] = useState();

  const selectedStore = stores.find((store) => store.id == storeId);

  const toggleFavorite = () => {
    if (isFavorite) {
      setIsFavorite(false);
    } else {
      setIsFavorite(true);
    }
  };
  
  return (
    <>
      <div className={style.cardSquare}>
        
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
        <img src={image} alt="image" />
        <h2>{title}</h2>
        <h3>{marca ? marca : <p></p>}</h3>
        <h4>${price}</h4>
        <h4>Stock: {stock}</h4>
        <h4>{delivery ? 'Envío disponible 🛵' : 'Retiro en tienda 🙋🏻‍♂️'}</h4>
        <Link to={`/post/${id}`}>
        <button className={style.comprar}>Ver</button>
        </Link>
      </div>
    </>
  );
};

export default CardSquare;
