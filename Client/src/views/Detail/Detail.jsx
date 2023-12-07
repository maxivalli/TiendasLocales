import React from "react";
import {Link} from 'react-router-dom'
import ProductImages from "../../components/productImages/ProductImages";
import Head from "../../components/Head/Head";
import style from "./Detail.module.css";
import b1 from "../../assets/1.jpeg";
import b2 from "../../assets/2.jpeg";
import b3 from "../../assets/3.jpeg";
import avatar from "../../assets/storeAvatar.jpg";

const Detail = () => {
  return (
    <>
      <Head />
      <div className={style.detail}>
        <div className={style.sidebar}>
          <Link to="/store">
          <div className={style.avatar}>
            <img src={avatar} alt="avatar" />
            <h3>Pizza Land</h3>
          </div>
          </Link>
          <div className={style.contact}>
            <h4>Av. Libertador 1234</h4>
            <h4>Comidas</h4>
            <h4>11:00 a 23:00</h4>
          </div>
        </div>
        <div className={style.images}>
          <ProductImages b1={b1} b2={b2} b3={b3} />
        </div>

        <div className={style.info}>
          <h2>Pizza 8 porciones</h2>
          <div className={style.precio}>
            <span>Precio:</span>
            <h4>$3500</h4>
          </div>
          <label>Cantidad:</label>
          <input
            type="number"
            id="cantidad"
            name="cantidad"
            min="1"
            max="10"
            step="1"
          ></input>
          <h5>Envío gratis</h5>
          <div className={style.comprar}>
            <button>Comprar</button>
          </div>
        </div>
      </div>
      <div className={style.desc}>
        <h5>Descripción</h5>
        <p>Variedades: Anchoas, Palmitos, Especial, Napolitana</p>
      </div>
    </>
  );
};

export default Detail;
