import React, { useState, useEffect } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import style from "./ProductImages.module.css";

const ProductImages = ({ images }) => {
  
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
          <img src={images} alt="image" /> 
        </div>
      </Carousel>
    </div>
  );
};

export default ProductImages;
