import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CardsStore from "../../components/CardsStore/CardsStore";
import Filters from '../../components/Filters/Filters'
import style from "./Favorites.module.css";
import Head from "../../components/Head/Head";
import { getAllStores, getFavorites } from "../../redux/actions";

const Favorites = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.userData);
  const stores = useSelector((state) => state.allStores);
  const favorites = useSelector((state) => state.favorites);

  const userId = userData.id;

  useEffect(() => {
    dispatch(getAllStores());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getFavorites(userId));
  }, [dispatch]);

  const favoriteStores = stores.filter((store) =>
    favorites.some((favorite) => favorite.storeId === store.id)
  );

  return (
    <>
      <Filters/>
      <Head />
      <div className={style.favoritas}>
        <h2 className={style.title}>Tiendas favoritas</h2>
        <div className={style.stores}>
          {favoriteStores.map((store, index) => (
            <CardsStore key={index} {...store} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Favorites;
