import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Banner from "../../components/Banners/Banners";
import Cards from "../../components/Cards/Cards";
import CardsStore from "../../components/CardsStore/CardsStore";
import SearchBar from "../../components/SearchBar/SearchBar";
import style from "./Home.module.css";
import Head from "../../components/Head/Head";
import b1 from "../../assets/Banner1.jpg";
import b2 from "../../assets/Banner2.jpg";
import b3 from "../../assets/Banner3.jpg";
import { getAllStores } from "../../redux/actions";

const Home = () => {
  const dispatch = useDispatch();
  const userDataState = useSelector((state) => state.userData)

useEffect(() => {
  dispatch(getAllStores())
}, [dispatch])

  return (
    <>
      <SearchBar />
      <Head/>
      <div className={style.home}>
        <div>
          <Banner b1={b1} b2={b2} b3={b3}/>
        </div>

        <div className={style.title}>
          <h2>Productos destacados</h2>
          <p>Explora y compra los mejores productos</p>
        </div>

        <div className={style.cards}>
          <Cards />
        </div>

        <div className={style.title}>
          <h2>Tiendas destacadas</h2>
          <p>Explora la tiendas destacadas de tu ciudad</p>
        </div>

        <div className={style.stores}>
          <CardsStore />
        </div>
      </div>
    </>
  );
};

export default Home;
