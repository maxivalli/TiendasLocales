import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

import Filters from "../../components/Filters/Filters";
import CardSquare from "../../components/CardSquare/CardSquare";
import Head from "../../components/Head/Head";

import style from "./MySales.module.css";

const MySales = () => {
  const userData = useSelector((state) => state.userData);
  const [comprasData, setCompras] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `/tiendas/comprasRecibidas/${userData.id}`
        );
        if (response) {
          setCompras(response.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [userData.id]);

  console.log(comprasData);

  return (
    <>
      <Filters />
      <Head />
      <div className={style.misventas}>
        <h2 className={style.title}>Mis ventas</h2>

        <h3>Pendientes</h3>
        <div className={style.pendientes}>
          {comprasData.map((item, index) => {
            return (
              <CardSquare
                key={index}
                id={item?.postId}
                image={item?.productImage}
                title={item?.title}
                price={item?.unit_price}
                stock={item?.quantity}
                delivery={true}
              />
            );
          })}
        </div>

        <h3>Enviadas o entregadas</h3>
        <div className={style.entregadas}></div>
      </div>
    </>
  );
};

export default MySales;
