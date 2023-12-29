import React from "react";
import style from "./CardSale.module.css";

const CardSale = ({
  image,
  title,
  price,
  quantity,
  delivery,
  user,
  adress,
  phone,
  fn,
  id,
}) => {
  return (
    <>
      <div className={style.cardSale}>
        <div className={style.head}>
          <img src={image} alt="foto producto" />
          <h3>{title}</h3>
        </div>
        <div className={style.info}>
          <div className={style.price}>
            <span>Precio:</span>
            <p>${price}</p>
          </div>

          <div className={style.quantity}>
            <span>Cantidad:</span>
            <p>{quantity}</p>
          </div>

          <div className={style.user}>
            <span>Comprador:</span>
            <p>{user}</p>
          </div>

          <div className={style.delivery}>
            <span>Entrega:</span>
            <p>{delivery ? "Envío a domicilio 🛵" : "Retira en tienda 🙋🏻‍♂️"}</p>
          </div>

          <div className={style.adress}>
            <span>Dirección:</span>
            <p>{adress}</p>
          </div>

          <div className={style.phone}>
            <span>Teléfono:</span>
            <p>{phone}</p>
          </div>

        </div>

        <div className={style.button}>
          {delivery ? (
            <button onClick={fn}>Enviado</button>
          ) : (
            <button onClick={fn}>Entregado</button>
          )}
        </div>
      </div>
    </>
  );
};

export default CardSale;
