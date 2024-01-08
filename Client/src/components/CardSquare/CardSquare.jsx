import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import {
  addFavoritePost,
  deletePost,
  getFavorites,
  removeFavoritePost,
} from "../../redux/actions";
import style from "./CardSquare.module.css";
import ProductUpdate from "../ProductUpdate/ProductUpdate";
import likeG from "../../assets/likeG.png";
import likeR from "../../assets/likeR.png";
import edit from "../../assets/edit.png";
import del from "../../assets/delete.png";
import axios from "axios";

const CardSquare = ({
  id,
  title,
  enviado,
  marca,
  price,
  stock,
  delivery,
  image,
  storeId,
  onDelete,
}) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const postId = id;
  const userData = useSelector((state) => state.userData);
  const favorites = useSelector((state) => state.favorites);
  const isPostFavorite =
    favorites && favorites.some((favorite) => favorite.postId === postId);
  const [isFavorite, setIsFavorite] = useState(isPostFavorite);
  const [showModal, setShowModal] = useState(false);
  const userId = userData?.id;

  const toggleFavorite = () => {
    if (isFavorite) {
      setIsFavorite(false);
      dispatch(removeFavoritePost(userId, storeId, postId));
    } else {
      setIsFavorite(true);
      dispatch(addFavoritePost(userId, storeId, postId));
    }
  };

  useEffect(() => {
    const isPostFavorite =
      favorites && favorites.some((favorite) => favorite.postId === postId);
    setIsFavorite(isPostFavorite);
  }, [favorites, postId]);

  useEffect(() => {
    if (userId !== undefined) {
      dispatch(getFavorites(userId));
    }
  }, [userId]);

  function handleDelete(id) {
    const confirmDelete = window.confirm(
      "¿Estás seguro que quieres eliminar esta publicación?"
    );
    if (confirmDelete) {
      dispatch(deletePost(id));
    }
  }

  const openModal = () => {
    setShowModal(true);
  };

  const esVistaMiCuenta = location.pathname.includes("/micuenta");
  const esVistaMiTienda = location.pathname.includes("/mitienda");

  const handleEliminado = async (id) => {
    try {
      const newEliminado = await axios.post("/tiendas/eliminado", {
        postId: id,
      });
      if (newEliminado) {
        window.location.reload();
      }
    } catch (error) {
      console.error("Error handling elimination:", error);
    }
  };

  return (
    <>
      <div className={style.cardSquare}>
        <div className={style.favorite} onClick={toggleFavorite}>
          <img
            src={isFavorite ? likeR : likeG}
            alt="like"
            className={style.fav}
          />
        </div>

        <Link to={`/post/${id}`}>
          <img src={image} alt="image" />
          <h2>{title}</h2>
          <h3 className={style.marca}>{marca ? marca : <p></p>}</h3>
          <h3>${price}</h3>
          <h4>
            {esVistaMiCuenta ? "Cantidad" : "Stock"}: {stock}
          </h4>
          <h4>{delivery ? "Envío disponible 🛵" : "Retirar en tienda 🙋🏻‍♂️"}</h4>
          {esVistaMiCuenta && enviado && enviado === true(<h4>Enviado</h4>)}
        </Link>
        {esVistaMiTienda && (
          <div className={style.prodBut}>
            <button className={style.edit} onClick={openModal}>
              <img width="30" height="30" src={edit} alt="edit--v1" />
            </button>
            <button className={style.delete} onClick={() => handleDelete(id)}>
              <img width="24" height="24" src={del} alt="filled-trash" />
            </button>
          </div>
        )}

        {onDelete && (
          <div className={style.prodBut}>
            <button
              onClick={() => handleEliminado(id)}
              className={style.delete}
            >
              <img width="24" height="24" src={del} alt="filled-trash" />
            </button>
          </div>
        )}

        {showModal && (
          <div className={style.modal}>
            <button className={style.close} onClick={() => setShowModal(false)}>
              X
            </button>
            <ProductUpdate id={id} />
          </div>
        )}
      </div>
    </>
  );
};

export default CardSquare;
