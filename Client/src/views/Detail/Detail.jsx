import React from "react";
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
        <div className={style.images}>
          <ProductImages b1={b1} b2={b2} b3={b3} />
        </div>

        <div className={style.info}>
          <div className={style.avatar}>
            <img src={avatar} alt="avatar" />
            <h3>Pizza Land</h3>
          </div>
          <h2>Pizza 8 porciones</h2>
          <div className={style.precio}>
            <span>Precio:</span>
            <h4>$3500</h4>
          </div>

          <label for="cantidad">Cantidad:</label>
          <input
            type="number"
            id="cantidad"
            name="cantidad"
            min="1"
            max="10"
            step="1"
          ></input>
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
