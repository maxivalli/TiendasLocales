import React, {useEffect} from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CardSquare from "../CardSquare/CardSquare";
import style from "./Cards.module.css";
import { useSelector, useDispatch } from "react-redux";
import { getAllPosts } from "../../redux/actions";


const Cards = () => {

  const dispatch = useDispatch();
  const posts = useSelector((state) => state.allPosts)

  useEffect(() => {
    dispatch(getAllPosts())
  }, [dispatch])

  const settings = {
    arrows: true,
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: Math.min(3, posts.length),
    slidesToScroll: 3,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: Math.min(2, posts.length),
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
         
          {posts.map((post, index) => (
          <CardSquare key={index} {...post}/>
          ))}

        </Slider>
      </div>
      <div className={style.section}></div>
    </>
  );
};

export default Cards;
