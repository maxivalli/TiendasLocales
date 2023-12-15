import React, {useState, useEffect} from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import style from "./ProductImages.module.css";
import disc from '../../assets/disc.png'

const ProductImages = ({ images }) => {

  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const updateOnlineStatus = () => {
      setOnline(navigator.onLine);
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

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
        {online ? (
            <img src={images} alt="image" />
          ) : (
            <img src={disc} alt="default image" />
          )}
        </div>
       
      </Carousel>
    </div>
  );
};

export default ProductImages;
