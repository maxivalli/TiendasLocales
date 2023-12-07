import React from "react";
import {Link} from 'react-router-dom'
import style from "./CardSquare.module.css";

const CardSquare = ({image, title, price, store}) => {
  return (
    <>
      <div className={style.cardSquare}>
        <img src={image} alt="image" />
        <h2>{title}</h2>
        <h3>{price}</h3>
        <h4>{store}</h4>
        <Link to='/detail'>
        <button className={style.comprar}>Ver</button>
        </Link>
      </div>
    </>
  );
};

export default CardSquare;
