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
import ReactPaginate from "react-paginate";

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
  const [filteredPostsPaginado, setFilteredPosts] = useState([]);
  const [filteredStoresPaginado, setFilteredStores] = useState([]);
  const [storePage, setStorePage] = useState(1);
  const [postPage, setPostPage] = useState(1);
  const storesPerPage = 4;
  const postsPerPage = 6;

  useEffect(() => {
    const storedStores = JSON.parse(localStorage.getItem("stores")) || [];
    const storedPosts = JSON.parse(localStorage.getItem("posts")) || [];
    if (storedStores.length > 0) {
      dispatch(setFilteredStoresByName(storedStores));
      setStores(
        storedStores.filter((store) => store.habilitado === "habilitado")
      );
    }
    if (storedPosts.length > 0) {
      dispatch(setFilteredPostsByName(storedPosts));
      setFilteredPosts(storedPosts);
    }
    setTimeout(() => {
      setLoading(false);
    }, 750);
  }, [dispatch]);

  useEffect(() => {
    const filtered =
      stores && stores.filter((store) => store.habilitado === "habilitado");
    setStores(filtered);
    localStorage.setItem("stores", JSON.stringify(filtered));
  }, [dispatch, stores]);

  useEffect(() => {
    const startStoreIndex = (storePage - 1) * storesPerPage;
    const endStoreIndex = startStoreIndex + storesPerPage;
    setFilteredStores(filterStores.slice(startStoreIndex, endStoreIndex));
  }, [filterStores, storePage]);

  useEffect(() => {
    const startPostIndex = (postPage - 1) * postsPerPage;
    const endPostIndex = startPostIndex + postsPerPage;
    setFilteredPosts(posts.slice(startPostIndex, endPostIndex));
    localStorage.setItem("posts", JSON.stringify(posts));
  }, [posts, postPage]);

  const handleStorePageClick = (data) => {
    setStorePage(data.selected + 1);
  };

  const handlePostPageClick = (data) => {
    setPostPage(data.selected + 1);
  };


  
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
          {filteredStoresPaginado &&
            filteredStoresPaginado.map((store, index) => (
              <CardsStore key={index} {...store} />
            ))}
        </div>

        {filterStores.length > storesPerPage && (
          <ReactPaginate
            pageCount={Math.ceil(filterStores.length / storesPerPage)}
            pageRangeDisplayed={2}
            marginPagesDisplayed={1}
            onPageChange={handleStorePageClick}
            containerClassName={style.pagination}
            activeClassName={style.active}
            nextLabel=">"
            previousLabel="<"
          />
        )}

        <div className={style.title}>
          <h2>Productos</h2>
          {posts.length === 0 && (
            <div className={style.noProd}>
              <p>No hay productos que coincidan con la búsqueda</p>
            </div>
          )}
        </div>
        <div className={style.productos}>
          {filteredPostsPaginado &&
            filteredPostsPaginado.map((store, index) => (
              <CardSquare key={index} {...store} />
            ))}
        </div>

        {posts.length > postsPerPage && (
          <ReactPaginate
            pageCount={Math.ceil(posts.length / postsPerPage)}
            pageRangeDisplayed={2}
            marginPagesDisplayed={1}
            onPageChange={handlePostPageClick}
            containerClassName={style.pagination2}
            activeClassName={style.active2}
            nextLabel=">"
            previousLabel="<"
          />
        )}
        <div className={style.margin}></div>
      </div>
    </>
  );
};

export default SearchResult;
