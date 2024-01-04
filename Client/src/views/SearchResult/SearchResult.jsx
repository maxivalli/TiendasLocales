import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Banner from "../../components/Banners/Banners";
import CardsStore from "../../components/CardsStore/CardsStore";
import Filters from "../../components/Filters/Filters";
import Head from "../../components/Head/Head";
import b4 from "../../assets/Banner4.jpg";
import b5 from "../../assets/Banner5.jpg";
import b6 from "../../assets/Banner6.jpg";
import style from "./SearchResult.module.css";
import CardSquare from "../../components/CardSquare/CardSquare";
import {
  setFilteredPostsByName,
  setFilteredStoresByName,
} from "../../redux/actions";

const SearchResult = () => {
  const dispatch = useDispatch();
  const stores = useSelector((state) => state.filteredStoresByName);
  const posts = useSelector((state) => state.filteredPostsByName);
  const [filterStores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedStores = JSON.parse(localStorage.getItem("stores")) || [];
    const storedPosts = JSON.parse(localStorage.getItem("posts")) || [];

    if (storedStores.length > 0) {
      dispatch(setFilteredStoresByName(storedStores));
    }
    if (storedPosts.length > 0) {
      dispatch(setFilteredPostsByName(storedPosts));
    }

    setTimeout(() => {
      setLoading(false); 
    }, 750); 
  }, [dispatch]);

  useEffect(() => {
    const filtered =
      stores && stores.filter((store) => store.habilitado === "habilitado");
    setStores(filtered);
  }, [dispatch, stores]);

  if (loading) {
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
      <Filters />
      <Head />
      <div className={style.home}>
        <div>
          <Banner b1={b4} b2={b5} b3={b6} />
        </div>

        <div className={style.title}>
          <h2>Tiendas</h2>
          {filterStores.length === 0 && (
            <div className={style.noTiend}>
              <p>No hay tiendas que coincidan con la búsqueda</p>
            </div>
          )}
        </div>
        <div className={style.stores}>
          {filterStores &&
            filterStores.map((store, index) => (
              <CardsStore key={index} {...store} />
            ))}
        </div>

        <div className={style.title}>
          <h2>Productos</h2>
          {posts.length === 0 && (
            <div className={style.noProd}>
              <p>No hay productos que coincidan con la búsqueda</p>
            </div>
          )}
        </div>
        <div className={style.productos}>
          {posts &&
            posts.map((store, index) => <CardSquare key={index} {...store} />)}
        </div>
      </div>
    </>
  );
};

export default SearchResult;
