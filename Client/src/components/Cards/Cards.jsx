import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CardSquare from "../CardSquare/CardSquare";
import hambur from "../../assets/hambur.jpg";
import empan from "../../assets/empan.jpg";
import pizza from "../../assets/pizza.jpg";
import style from "./Cards.module.css";

const Cards = () => {
  const settings = {
    arrows: true,
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          arrows: false,
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <>
      <div className={style.cards}>
        <Slider {...settings}>
          <div className={style.card}>
            <CardSquare
              image={hambur}
              title={"Hamburquesa Americana"}
              price={"$2500"}
              store={"Pizza Land"}
            />
          </div>
          <div className={style.card}>
            <CardSquare
              image={empan}
              title={"Empanadas docena"}
              price={"$3500"}
              store={"Pizza Land"}
            />
          </div>
          <div className={style.card}>
            <CardSquare
              image={pizza}
              title={"Pizza 8 porciones"}
              price={"$5000"}
              store={"Pizza Land"}
            />
          </div>
        </Slider>
      </div>
      <div className={style.section}></div>
    </>
  );
};

export default Cards;
