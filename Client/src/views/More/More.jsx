import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CardWide from "../../components/CardWide/CardWide";
import Head from '../../components/Head/Head'
import style from "./More.module.css";
import axios from "axios";
import { useSelector } from "react-redux";

const More = () => {
  const userData = useSelector((state) => state.userData);
  const [storeData, setStoreData] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/tiendas/getStore", {
          params: { id: userData.id },
        });
        if (response) {
          setStoreData(response.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [userData.id]);

  return (
    <>
    <Head/>
      <div className={style.section}></div>
      <div className={style.more}>
        {!storeData && (
          <CardWide
            textButton={"Crear Tienda"}
            logo={
              <img
                width="60"
                height="60"
                src="https://img.icons8.com/parakeet/96/add-shop.png"
                alt="add-shop"
              />
            }
            link={"/createstore"}
          />
        )}
        {userData.vendedor === "vendedor" &&
        storeData?.habilitado === "habilitado" ? (
          <CardWide
            textButton={"Mi Tienda"}
            logo={
              <img
                width="60"
                height="60"
                src="https://img.icons8.com/parakeet/96/online-order.png"
                alt="online-order"
              />
            }
            link={`/mystore/${storeData.id}`}
          />
        ) : (
          storeData &&
          userData.vendedor === "noVendedor" && (
            <>
            <CardWide
              textButton={"En espera"}
              logo={
                <img
                  width="60"
                  height="60"
                  src="https://img.icons8.com/color/96/hourglass.png"
                  alt="hourglass"
                />
              }
            />
            {!userData.accT && <button onClick={()=>{window.location.href = `https://auth.mercadopago.com/authorization?client_id=6356168129471214&response_type=code&platform_id=mp&state=${userData.id}&redirect_uri=https://362c-201-190-175-186.ngrok.io/tiendas/redirectUrl`;}}>
              Conectar MP
            </button>}

            </>)
        )}
        <CardWide
          textButton={"Consultas"}
          logo={
            <img
              width="60"
              height="60"
              src="https://img.icons8.com/pulsar-color/96/mail.png"
              alt="mail"
            />
          }
          link={"/queries"}
        />
        <CardWide
          textButton={"FAQ"}
          logo={
            <img
              width="60"
              height="60"
              src="https://img.icons8.com/pulsar-color/96/seo-text.png"
              alt="seo-text"
            />
          }
          link={"/faq"}
        />
        {userData.rol === "admin" && (
          <div className={style.admin}>
            <Link to="/dashboard">
              <button>
                <img
                  width="32"
                  height="32"
                  src="https://img.icons8.com/parakeet/96/administrative-tools.png"
                  alt="administrative-tools"
                />
              </button>
            </Link>
          </div>
        )}
        <div></div>
        <Link>
          <button className={style.tyc}>Términos y condiciones</button>
        </Link>
        <Link>
          <button className={style.pdp}>Política de privacidad</button>
        </Link>
      </div>
    </>
  );
};

export default More;
