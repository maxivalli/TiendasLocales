import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { addFavoritePost, getFavorites, removeFavoritePost } from "../../redux/actions";
import { socket } from "../../App";

import style from "./CardSquare.module.css";

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
  
  
  const userId = userData?.id;
  const postId = id
  
  const isPostFavorite = favorites && favorites.some((favorite)=> favorite.postId === postId)
  const [isFavorite, setIsFavorite] = useState(isPostFavorite);

  const toggleFavorite = () => {
    const addText = `¡Se ha agregado "${title}" a favoritos!`
    const addData = { userId, storeId, addText, image, postId };
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
    const isPostFavorite = favorites && favorites.some((favorite)=> favorite.postId === postId)
    setIsFavorite(isPostFavorite);
  }, [favorites, postId]);

  useEffect(() => {
    if(userId !== undefined) {
    dispatch(getFavorites(userId));
    }
  }, [userId]);

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
          <h4>Stock: {stock}</h4>
          <h4>{delivery ? "Envío disponible 🛵" : "Retiro en tienda 🙋🏻‍♂️"}</h4>
        </Link>
      </div>
    </>
  );
};

export default CardSquare;
