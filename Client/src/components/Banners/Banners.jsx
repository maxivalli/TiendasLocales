import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Banner1 from "../../assets/Banner1.jpg";
import Banner2 from "../../assets/Banner2.jpg";
import Banner3 from "../../assets/Banner3.jpg";
import style from './Banners.module.css'

const Banners = () => {


  return (
    
    <div className={style.banners}>
      <Carousel
        autoPlay
        infiniteLoop
        showStatus={false}
        showThumbs={false}
        showIndicators={false}
        showArrows={false}
        interval={3000}
        stopOnHover={true}
      >
        <div>
      <img src={Banner1} alt="banner1" />
      </div>
      <div>
      <img src={Banner2} alt="banner2" />
      </div>
      <div>
      <img src={Banner3} alt="banner2" />
      </div>
      </Carousel>
    </div>
  );
};

export default Banners;
