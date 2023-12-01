import React from "react";
import Banner from "../../components/Banners/Banners";
import Cards from "../../components/Cards/Cards";
import fuego from "../../assets/fuego.gif";
import style from "./Home.module.css";

const Home = () => {
  return (
    <>
      <Banner />
      <div className={style.home}>
        {/* <div className={style.fire}>
          <h2>Destacados</h2>
          <img src={fuego} alt="fuego" />
        </div> */}
        <div>
          <Cards/>
        </div>
      </div>
    </>
  );
};

export default Home;
