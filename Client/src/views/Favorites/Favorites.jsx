import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CardsStore from "../../components/CardsStore/CardsStore";
import Filters from "../../components/Filters/Filters";
import style from "./Favorites.module.css";
import Head from "../../components/Head/Head";
import { getAllPosts, getAllStores, getFavorites } from "../../redux/actions";
import CardSquare from "../../components/CardSquare/CardSquare";

const Favorites = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.userData);
  const stores = useSelector((state) => state.allStores);
  const favorites = useSelector((state) => state.favorites);
  const posts = useSelector((state) => state.allPosts);

  const userId = userData.id;

  useEffect(() => {
    dispatch(getAllStores());
    dispatch(getAllPosts());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getFavorites(userId));
  }, [dispatch]);

  const favoriteStores = stores && stores.filter((store) =>
    favorites.some(
      (favorite) => favorite.storeId === store.id && favorite.postId === null
    )
  );

  const favoritePosts = posts && posts.filter((post) =>
    favorites.some((favorite) => favorite.postId === post.id)
  );

  let noFavoriteStores = favoriteStores.length === 0;
  let noFavoritePosts = favoritePosts.length === 0;

  return (
    <>
      <Filters />
      <Head />
      <div className={style.favoritas}>
        <h2 className={style.title}>Tiendas favoritas</h2>

        {noFavoriteStores ? (
          <p>Aún no agregaste tiendas favoritas.</p>
        ) : (
          <div className={style.stores}>
            {favoriteStores.map((store, index) => (
              <CardsStore key={index} {...store} />
            ))}
          </div>
        )}

        <h2 className={style.title}>Productos favoritos</h2>

        {noFavoritePosts ? (
          <p>Aún no agregaste productos favoritos.</p>
        ) : (
          <div className={style.products}>
            {favoritePosts.map((post, index) => (
              <CardSquare key={index} {...post} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Favorites;
