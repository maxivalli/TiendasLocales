import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ProductImages from "../../components/productImages/ProductImages";
import Head from "../../components/Head/Head";
import style from "./Detail.module.css";
import { useDispatch, useSelector } from "react-redux";
import { getPostById, updateStock } from "../../redux/actions";
import axios from "axios";

const Detail = ({userData}) => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const selectedPost = useSelector((state) => state.selectedPost);
  const stores = useSelector((state) => state.allStores);
  
  const [quantity, setQuantity] = useState(1);
  const [buyClickCounter, setBuyClickCounter] = useState(1);
  
  const selectedStore = stores?.find((store) => store.id == selectedPost?.storeId);
  const postId = selectedPost?.id
  const stock = selectedPost?.stock
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
    dispatch(getPostById(id));
  }, [dispatch]);

const handlePremium = async () => {
    try {
      if (quantity > 0 && quantity <= selectedPost.stock) {
        dispatch(updateStock(quantity, postId));
        setBuyClickCounter((prevCounter) => prevCounter + 1);
      } else {
        throw new Error ("Disculpe, no hay mas stock disponible");
      }
        const paymentData = {
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

  return (
    <>
      <Head />
      <div className={style.detail}>
        <div className={style.sidebar}>
          <Link to="/store">
            <div className={style.avatar}>
              <img src={selectedStore?.image} alt="avatar" />
              <h3>{selectedStore?.nombre}</h3>
            </div>
          </Link>
          <div className={style.contact}>
            <h4>📍 {selectedStore?.direccion}</h4>
            <h4>{selectedStore?.categoria}</h4>
            <h4>⏰ {selectedStore?.horarios}</h4>
          </div>
        </div>
        <div className={style.images}>
          <ProductImages images={selectedPost.image} />
        </div>

        <div className={style.info}>
          <h2>{selectedPost.title}</h2>
          <div className={style.precio}>
            <span>Precio:</span>
            <h4>${selectedPost.price}</h4>
          </div>
          <label>cantidad:</label>
          <div>
            <button onClick={decrement}>-</button>
            <input
              type="number"
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
          <p> stock: {selectedPost.stock}</p>
          <h5>
            {selectedPost.delivery
              ? "Envío disponible 🛵"
              : "Retiro en tienda 🙋🏻‍♂️"}
          </h5>
          <div className={style.comprar}>
          <button onClick={handlePremium} disabled={isBuyButtonDisabled}>Comprar</button>
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
