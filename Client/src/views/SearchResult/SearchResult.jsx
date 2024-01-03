import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Banner from "../../components/Banners/Banners";
import CardsStore from "../../components/CardsStore/CardsStore";
import Filters from "../../components/Filters/Filters";
import Head from "../../components/Head/Head";
import b1 from "../../assets/Banner1.jpg";
import b2 from "../../assets/Banner2.jpg";
import b3 from "../../assets/Banner3.jpg";
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
  const [isLoading, setIsLoading] = useState(true);

  const [filterStores, setStores] = useState([]);

  useEffect(() => {
    const storedStores = JSON.parse(localStorage.getItem("stores")) || [];
    const storedPosts = JSON.parse(localStorage.getItem("posts")) || [];

    if (storedStores.length > 0) {
      dispatch(setFilteredStoresByName(storedStores));
    }
    if (storedPosts.length > 0) {
      dispatch(setFilteredPostsByName(storedPosts));
    }

    if (stores) {
      localStorage.setItem("stores", JSON.stringify(stores));
    }
    if (posts) {
      localStorage.setItem("posts", JSON.stringify(posts));
    }

    setIsLoading(false);
    return () => {
      localStorage.removeItem("stores");
      localStorage.removeItem("posts");
    };
  }, [dispatch, stores, posts]);

  useEffect(() => {
    const filtered =
      stores && stores.filter((store) => store.habilitado === "habilitado");
    setStores(filtered);
  }, [dispatch, stores]);

  /*   const sortedStores =
    filterStores &&
    filterStores
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10); */

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
      <Filters />
      <Head />
      <div className={style.home}>
        <div>
          <Banner b1={b1} b2={b2} b3={b3} />
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
