import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CardWide from "../../components/CardWide/CardWide";
import Head from "../../components/Head/Head";
import style from "./More.module.css";
import axios from "axios";
import { useSelector } from "react-redux";
import crear from '../../assets/crear.png'
import mitienda from '../../assets/mitienda.png'
import contacto from '../../assets/contacto.png'
import faq from '../../assets/faq.png'
import espera from '../../assets/espera.png'
import controlP from '../../assets/controlP.png'

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
          <CardWide
            textButton={"Mi Tienda"}
            logo={
              <img
                width="60"
                height="60"
                src={mitienda}
                alt="online-order"
              />
            }
            link={`/mitienda/${storeData.id}`}
          />
        ) : (
          storeData &&
          userData.vendedor === "noVendedor" &&
          (
            <>
            <div className={style.cenC}>
              <p>
                Para que la tienda sea habilitada deberás pagar<br></br>
                la suscripción en el centro Centro Comercial,<br></br>
                allí el personal aprobará tu cuenta.
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
          textButton={"FAQ"}
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
