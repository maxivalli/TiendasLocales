import React from "react";
import hambur from "../../assets/hambur.jpg";
import style from "./CardSquare.module.css";

const CardSquare = () => {
  return (
    <>
      <div className={style.cardSquare}>
        <img src={hambur} alt="" />
        <h2>Hamburguesa Completa</h2>
        <h3>$2500</h3>
        <button>Ver</button>
      </div>
    </>
  );
};

export default CardSquare;
