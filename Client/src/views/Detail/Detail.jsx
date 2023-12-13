import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import ProductImages from "../../components/productImages/ProductImages";
import Head from "../../components/Head/Head";
import style from "./Detail.module.css";
import b1 from "../../assets/1.jpeg";
import b2 from "../../assets/2.jpeg";
import b3 from "../../assets/3.jpeg";
import avatar from "../../assets/storeAvatar.jpg";
import { useDispatch, useSelector } from "react-redux";
import { getPostById } from "../../redux/actions";

const Detail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const selectedPost = useSelector((state) => state.selectedPost);
  const stores = useSelector((state) => state.allStores);

  const selectedStore = stores?.find(
    (store) => store.id == selectedPost?.storeId
  );
  console.log(selectedStore);

  useEffect(() => {
    dispatch(getPostById(id));
  }, [dispatch]);

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
          <label>Cantidad:</label>
          <input
            type="number"
            id="cantidad"
            name="cantidad"
            min="1"
            max="10"
            step="1"
          ></input>
          <h5>Envío disponible 🛵</h5>
          <div className={style.comprar}>
            <button>Comprar</button>
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
