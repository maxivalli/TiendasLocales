import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import style from "./ProductImages.module.css";

const ProductImages = ({ b1, b2, b3 }) => {
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
          <img src={b1} alt="banner1" />
        </div>
        <div>
          <img src={b2} alt="banner2" />
        </div>
        <div>
          <img src={b3} alt="banner2" />
        </div>
      </Carousel>
    </div>
  );
};

export default ProductImages;
