import React, {useEffect} from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CardSquare from "../CardSquare/CardSquare";
import style from "./Cards.module.css";
import { useSelector, useDispatch } from "react-redux";
import { getAllExistingPosts } from "../../redux/actions";


const Cards = () => {

  const dispatch = useDispatch();
  const posts = useSelector((state) => state.allExistingPosts)

  useEffect(() => {
    dispatch(getAllExistingPosts)
  }, [dispatch])

  console.log(posts)

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
