import { React, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from "../../assets/TLlogoAlpha.png";
import style from "./Landing.module.css";

const Landing = () => {
  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowModal(false);
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      {showModal && (
        <div className={style.modal}>
          <img src={Logo} alt="" />
        </div>
      )}
      <div className={style.landing}>
        <Link to="/home">
          <button>Ingresar</button>
        </Link>
      </div>
    </>
  );
};

export default Landing;
