import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ProductImages from "../../components/productImages/ProductImages";
import Head from "../../components/Head/Head";
import style from "./Detail.module.css";
import { useDispatch, useSelector } from "react-redux";
import { getPostById } from "../../redux/actions";
import axios from "axios";
import isStoreOpen from "../../components/isStoreOpen/isStoreOpen";

const Detail = ({ userData }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const selectedPost = useSelector((state) => state.selectedPost);
  const stores = useSelector((state) => state.allStores);
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(selectedPost.price);

  const [isLoading, setIsLoading] = useState(true);

  const selectedStore = stores?.find(
    (store) => store.id == selectedPost?.storeId
  );

  const linkName = selectedStore?.nombre.replace(/\s/g, "-");
  const isBuyButtonDisabled = quantity <= 0 || selectedPost.stock === 0;

  function decrement() {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  }
  function increment() {
    if (quantity < selectedPost.stock) {
      setQuantity(quantity + 1);
    }
  }

  useEffect(() => {
    setTotalPrice(selectedPost.price * quantity);
  }, [quantity, selectedPost.price]);

  useEffect(() => {
    dispatch(getPostById(id))
      .then(() => setIsLoading(false))
      .catch((error) => {
        setIsLoading(false);
        console.error("Error fetching post by ID:", error);
      });
  }, [dispatch, id]);

  const handlePremium = async () => {
    try {
      if (quantity > 0 && quantity <= selectedPost.stock) {
      } else {
        throw new Error("Disculpe, no hay mas stock disponible");
      }
      const result1 = await axios.get(`/posts/getPost/${selectedPost.id}`);

      const result = await axios.get(
        `/users/anotherUserId/?id=${result1.data.userId}`
      );

      const paymentData = {
        accT: result.data.accT,
        postId: selectedPost.id,
        userId: userData.id,
        title: selectedPost.title,
        quantity: quantity,
        price: selectedPost.price,
        currency_id: "ARG",
        description: selectedPost.description,
      };

      const response = await axios.post("/tiendas/create-order", paymentData);

      if (response) {
        window.location.href = response.data.response.body.init_point;
      } else {
        console.error("Init point not found in the response");
      }
    } catch (error) {
      console.error("Error al realizar solicitud de compra", error);
    }
  };

  if (isLoading) {
    return (
      <div className={style.spinner}>
        <div className={style.bounce1}></div>
        <div className={style.bounce2}></div>
        <div className={style.bounce3}></div>
      </div>
    );
  }

  return (
    <>
      <Head />
      <div className={style.detail}>
        <div className={style.sidebar}>
          <Link to={`/store/${linkName}`}>
            <div className={style.avatar}>
              <img src={selectedStore?.image} alt="image" />

              <h3>{selectedStore?.nombre}</h3>
            </div>
          </Link>
          <div className={style.contact}>
            <h4>
              {" "}
              <span
                style={{
                  color: isStoreOpen(
                    selectedStore?.dias,
                    selectedStore?.horarios
                  )
                    ? "cornflowerblue"
                    : "red",
                }}
              >
                {isStoreOpen(selectedStore?.dias, selectedStore?.horarios)
                  ? "✅ Abierto"
                  : "❗️ Cerrado"}
              </span>
            </h4>
            <h4>
              📍 {selectedStore?.direccion.calle}{" "}
              {selectedStore?.direccion.numero} (piso:{" "}
              {selectedStore?.direccion.piso} local:{" "}
              {selectedStore?.direccion.depto})
            </h4>
            <h4>{selectedStore?.categoria}</h4>
            <h4>📆 {selectedStore.dias}</h4>
            <h4>
              ⏰ {selectedStore.horarios.horario_de_apertura}hs a{" "}
              {selectedStore.horarios.horario_de_cierre}hs
              {selectedStore.horarios.horario_de_apertura2 &&
                selectedStore.horarios.horario_de_cierre2 && (
                  <>
                    {" y "}
                    {selectedStore.horarios.horario_de_apertura2}hs a{" "}
                    {selectedStore.horarios.horario_de_cierre2}hs
                  </>
                )}
            </h4>

          </div>
        </div>
        <div className={style.images}>
          <ProductImages images={selectedPost.image} />
        </div>

        <div className={style.info}>
          <h2>{selectedPost.title}</h2>
          <div className={style.precio}>
            <span>Precio:</span>
            <h4>${totalPrice}</h4>
          </div>

          <div className={style.but}>
            <button onClick={decrement}>-</button>
            <input
              id="cantidad"
              name="cantidad"
              min="1"
              max={selectedPost.stock}
              step="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
            ></input>
            <button onClick={increment}>+</button>
          </div>

          <p> Stock: {selectedPost.stock}</p>
          <div className={style.envio}>
            <h5>
              {selectedPost.delivery
                ? "Envío disponible 🛵"
                : "Retiro en tienda 🙋🏻‍♂️"}
            </h5>
          </div>
          <div className={style.comprar}>
            <button onClick={handlePremium} disabled={isBuyButtonDisabled}>
              Comprar
            </button>
          </div>
        </div>
      </div>
      <div className={style.desc}>
        <h5>Descripción</h5>
        <p>{selectedPost.description}</p>
      </div>
    </>
  );
};

export default Detail;
