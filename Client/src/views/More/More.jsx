import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CardWide from "../../components/CardWide/CardWide";
import Head from "../../components/Head/Head";
import Spinner from '../../components/Spinner/Spinner'
import style from "./More.module.css";
import axios from "axios";
import { useSelector } from "react-redux";
import crear from '../../assets/crear.png'
import mysales from '../../assets/mysales.png'
import mitienda from '../../assets/mitienda.png'
import contacto from '../../assets/contacto.png'
import faq from '../../assets/faq.png'
import espera from '../../assets/espera.png'
import controlP from '../../assets/controlP.png'

const More = () => {
  const userData = useSelector((state) => state.userData);
  
  const [storeData, setStoreData] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/tiendas/getStore", {
          params: { id: userData.id },
        });
        if (response) {
          setStoreData(response.data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [userData]);

  if (loading) {
    return (
      <Spinner/>
    );
  }
  return (
    <>
      <Head />
      <div className={style.section}></div>
      <div className={style.more}>
        {!storeData && (
          <CardWide
            textButton={"Crear Tienda"}
            logo={
              <img
                width="60"
                height="60"
                src={crear}
                alt="add-shop"
              />
            }
            link={"/createstore"}
          />
        )}
        {userData.vendedor === "vendedor" &&
        storeData?.habilitado === "habilitado" ? (
          <>
          <CardWide
            textButton={"Mi tienda"}
            logo={
              <img
                width="60"
                height="60"
                src={mitienda}
                alt="online-order"
              />
            }
            link={`/mitienda/${storeData && storeData.id}`}
          />
          <CardWide
            textButton={"Mis ventas"}
            logo={
              <img
                width="60"
                height="60"
                src={mysales}
                alt="online-order"
              />
            }
            link={`/misventas`}
          />
          </>
        ) : (
          storeData &&
          userData.vendedor === "noVendedor" &&
          (
            <>
            <div className={style.cenC}>
              <p>
                La habilitación de tiendas no es un proceso automático.<br></br>
                El personal del Centro Comercial, revisará sus datos<br></br>
                y si todo es correcto procederá a la habilitación.
              </p>
              </div>
              <CardWide
                textButton={"En espera"}
                logo={
                  <img
                    width="60"
                    height="60"
                    src={espera}
                    alt="hourglass"
                  />
                }
              />
            </>
          )
        )}
        <CardWide
          textButton={"Consultas"}
          logo={
            <img
              width="60"
              height="60"
              src={contacto}
              alt="mail"
            />
          }
          link={"/consultas"}
        />
        <CardWide
          textButton={"Preguntas"}
          logo={
            <img
              width="60"
              height="60"
              src={faq}
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
                  width="60"
                  height="60"
                  src={controlP}
                  alt="control-panel"
                />
              </button>
            </Link>
          </div>
        )}
      </div>
      <div className={style.bottom}>
        <Link>
          <button>Términos y condiciones</button>
        </Link>
        <Link>
          <button>Política de privacidad</button>
        </Link>
      </div>
    </>
  );
};

export default More;
