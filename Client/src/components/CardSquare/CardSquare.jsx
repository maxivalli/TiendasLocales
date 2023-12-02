import React from "react";
import style from "./CardSquare.module.css";

const CardSquare = ({image, title, price}) => {
  return (
    <>
      <div className={style.cardSquare}>
        <img src={image} alt="image" />
        <h2>{title}</h2>
        <h3>{price}</h3>
        <button className={style.ver}>Ver</button>
      </div>
    </>
  );
};

export default CardSquare;
