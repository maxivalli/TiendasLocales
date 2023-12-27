import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Banner from "../../components/Banners/Banners";
import Cards from "../../components/Cards/Cards";
import CardsStore from "../../components/CardsStore/CardsStore";
import SearchBar from "../../components/SearchBar/SearchBar";
import Head from "../../components/Head/Head";
import b1 from "../../assets/Banner1.jpg";
import b2 from "../../assets/Banner2.jpg";
import b3 from "../../assets/Banner3.jpg";
import style from "./SearchResult.module.css";
import CardSquare from "../../components/CardSquare/CardSquare";

const SearchResult = () => {
    const dispatch = useDispatch()
    const stores = useSelector((state) => state.allStores);
    const posts = useSelector((state) => state.allPosts);
  
    const [filterStores, setStores] = useState([]);

    useEffect(() => {
        const filtered = stores && stores.filter((store) => store.habilitado === "habilitado");
        setStores(filtered);
      }, [dispatch, stores]);

      const sortedStores = filterStores && filterStores.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10);


      return (
        <>
          <SearchBar />
          <Head />
          <div className={style.home}>
            <div>
              <Banner b1={b1} b2={b2} b3={b3} />
            </div>
    
            <div className={style.title}>
              <h2>Productos</h2>
              <p>Mira los últimos productos que publicaron</p>
            </div>
    
            <div className={style.stores}>
            {posts && posts.map((store, index) => (
                <CardSquare key={index} {...store} />
              ))}
            </div>
    
            <div className={style.title}>
              <h2>Tiendas destacadas</h2>
              <p>Explora las últimas tiendas que llegaron</p>
            </div>
    
            <div className={style.stores}>
              {sortedStores && sortedStores.map((store, index) => (
                <CardsStore key={index} {...store} />
              ))}
            </div>
          </div>
        </>
      );
    };
    
    export default SearchResult;
    