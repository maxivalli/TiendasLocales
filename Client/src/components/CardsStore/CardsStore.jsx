import React from "react";
import avatar from "../../assets/storeAvatar.jpg";
import style from "./CardsStore.module.css";

const CardsStore = () => {
  return (
    <div className={style.cardsStore}>
      <div className={style.imagen}>
        <img src={avatar} alt="avatar" />
      </div>
      <div className={style.texto}>
        <h2>Pizza Land</h2>
        <h4>Calification</h4>
        <h4>Categoria</h4>
      </div>
      <div className={style.boton}>
        <button>Ver</button>
      </div>
    </div>
  );
};

export default CardsStore;
