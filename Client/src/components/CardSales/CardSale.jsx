import React from "react";
import style from "./CardSale.module.css";
import { useNavigate } from "react-router-dom";

const CardSale = ({
  image,
  title,
  price,
  quantity,
  delivery,
  user,
  adress,
  enviado,
  fn,
  userStore
}) => {
const navigate = useNavigate()

  const handleChatButtonClick = async () => {
    const projectID = "236f9c42-06cc-414f-98cd-b7465ea5c29e";
    const userName = userStore?.nombre;
    const userSecret = userStore?.email;

    const apiUrl = "https://api.chatengine.io/chats/";

    const usernames = [user.username];
    const title = title;
    const isDirectChat = true;

    try {
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Project-ID": projectID,
          "User-Name": userName,
          "User-Secret": userSecret,
        },
        body: JSON.stringify({
          usernames,
          title,
          is_direct_chat: isDirectChat,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create chat");
      }
      navigate("/mensajes/usuario");
    } catch (error) {
      console.error("Error creating chat:", error.message);
      throw error;
    }
  };


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
            <p>{user.username}</p>
          </div>

          <div className={style.delivery}>
            <span>Entrega:</span>
            <p>{delivery ? "Envío a domicilio 🛵" : "Retira en tienda 🙋🏻‍♂️"}</p>
          </div>

          <div className={style.adress}>
            <span>Dirección:</span>
            {adress && (<p>{adress.direccion}</p>)}
          </div>

          <div className={style.phone}>
            <span>Teléfono:</span>
            {adress && adress.direccion && ( <p>{adress.direccion.celular}</p>)}
          </div>

        </div>

        <div className={style.button}>
            <button onClick={handleChatButtonClick}>Comunicarse</button>
        </div>

        <div className={style.button}>
          {enviado ? (
            <button disabled={true}>Enviado</button>
          ) : (
            <button onClick={fn}>Enviar</button>
          )}
        </div>
      </div>
    </>
  );
};

export default CardSale;
