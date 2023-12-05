import React from "react";
import Banner from "../../components/Banners/Banners";
import Cards from "../../components/Cards/Cards";
import CardsStore from "../../components/CardsStore/CardsStore";
import SearchBar from "../../components/SearchBar/SearchBar";
import style from "./Home.module.css";
import Head from "../../components/Head/Head";

const Home = ({userData}) => {
console.log(userData, "Esto en HOME");

  return (
    <>
      <SearchBar />
      <Head/>
      <div className={style.home}>
        <div>
          <Banner />
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
          <CardsStore userData={userData}/>
          <CardsStore />
          <CardsStore />
          <CardsStore />
        </div>
      </div>
    </>
  );
};

export default Home;
