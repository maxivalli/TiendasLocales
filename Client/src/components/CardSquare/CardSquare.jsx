import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import {
  addFavoritePost,
  deletePost,
  getFavorites,
  removeFavoritePost,
} from "../../redux/actions";
import { socket } from "../../App";
import style from "./CardSquare.module.css";
import ProductUpdate from "../ProductUpdate/ProductUpdate";

const CardSquare = ({
  id,
  title,
  marca,
  description,
  price,
  stock,
  delivery,
  image,
  storeId,
}) => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.userData);
  const favorites = useSelector((state) => state.favorites);
  const location = useLocation();

  const userId = userData?.id;
  const postId = id;

  const isPostFavorite =
    favorites && favorites.some((favorite) => favorite.postId === postId);
  const [isFavorite, setIsFavorite] = useState(isPostFavorite);

  const toggleFavorite = () => {
    const addText = `¡Se ha agregado "${title}" a favoritos!`;
    const addData = { userId, storeId, addText, image, postId, userData };
    if (isFavorite) {
      setIsFavorite(false);
      dispatch(removeFavoritePost(userId, storeId, postId));
      // socket.emit("removeFavorite", data);
    } else {
      setIsFavorite(true);
      dispatch(addFavoritePost(userId, storeId, postId));
      socket.emit("addFavoritePost", addData);
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

  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    setShowModal(true);
  };

  const esVistaMiCuenta = location.pathname.includes('/micuenta');
  const esVistaMiTienda = location.pathname.includes('/mitienda');

  return (
    <>
      <div className={style.cardSquare}>
        <div className={style.favorite} onClick={toggleFavorite}>
          <img
            src={
              isFavorite
                ? "https://img.icons8.com/ios-glyphs/30/FA5252/like--v1.png"
                : "https://img.icons8.com/ios-glyphs/30/737373/like--v1.png"
            }
            alt="like"
            className={style.fav}
          />
        </div>
        <Link to={`/post/${id}`}>
          <img src={image} alt="image" />
          <h2>{title}</h2>
          <h3>{marca ? marca : <p></p>}</h3>
          <h3>${price}</h3>
          <h4>{esVistaMiCuenta ? 'Cantidad' : 'Stock'}: {stock}</h4>
          <h4>{delivery ? "Envío disponible 🛵" : "Retirar en tienda 🙋🏻‍♂️"}</h4>
        </Link>
        {esVistaMiTienda && (
          <div className={style.prodBut}>
            <button className={style.edit} onClick={openModal}>
              <img
                width="30"
                height="30"
                src="https://img.icons8.com/glyph-neue/64/FFFFFF/edit--v1.png"
                alt="edit--v1"
              />
            </button>
            <button className={style.delete} onClick={() => handleDelete(id)}>
              <img
                width="24"
                height="24"
                src="https://img.icons8.com/pulsar-line/48/FFFFFF/filled-trash.png"
                alt="filled-trash"
              />
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
