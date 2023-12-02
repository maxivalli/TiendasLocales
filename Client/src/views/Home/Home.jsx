import React from "react";
import Banner from "../../components/Banners/Banners";
import Cards from "../../components/Cards/Cards";
import CardsStore from "../../components/CardsStore/CardsStore";
import fuego from "../../assets/fire.gif";
import diamond from '../../assets/diamond.gif'
import style from "./Home.module.css";

const Home = () => {
  return (
    <>
      <div className={style.home}>

        <div>
          <Banner />
        </div>

        <div className={style.title}>
          <img src={fuego} alt="fire" className={style.fire}/>
          <h2>Productos destacados</h2>
          <img src={fuego} alt="fire" className={style.fire}/>
        </div>

        <div className={style.cards}>
          <Cards />
        </div>

        <div className={style.title}>
          <img src={diamond} alt="diamond" className={style.diam}/>
        <h2>Tiendas destacadas</h2>
        <img src={diamond} alt="diamond" className={style.diam}/>
        </div>

        <div className={style.stores}>
          <CardsStore/>
          <CardsStore/>
          <CardsStore/>
          <CardsStore/>
        </div>
      </div>
    </>
  );
};

export default Home;
