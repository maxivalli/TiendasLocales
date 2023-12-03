import React from "react";
import {Link} from 'react-router-dom'
import avatar from "../../assets/storeAvatar.jpg";
import style from "./CardsStore.module.css";

const CardsStore = () => {
  return (
    <div className={style.cardsStore}>
      <img src="https://img.icons8.com/fluency/48/like.png" alt="like" className={style.fav}/>
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
