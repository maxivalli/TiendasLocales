import React from "react";
import Banner1 from "../../assets/Banner1.jpg";
import style from './Banners.module.css'

const Banners = () => {
  return (
    <div className={style.banners}>
      <img src={Banner1} alt="" />
    </div>
  );
};

export default Banners;
