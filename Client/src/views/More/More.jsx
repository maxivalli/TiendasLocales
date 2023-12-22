import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CardWide from "../../components/CardWide/CardWide";
import Head from "../../components/Head/Head";
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
            link={`/mitienda/${storeData.id}`}
          />
<<<<<<< HEAD
        ) : storeData &&
          userData.vendedor === "noVendedor" &&
          !userData.accT ? (
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
            <div className={style.MP}>
              <div className={style.modal}>
                <p>
                  Para que tu tienda sea aprobada primero necesitas conectar tu
                  cuenta de Mercado Pago para poder recibir el dinero de tus ventas.
                </p>
              </div>

              <CardWide
                Fn={handleConnectMP}
                textButton={"Conectar MP"}
                logo={
                  <img
                    width="60"
                    height="60"
                    src="https://img.icons8.com/color/96/mercado-pago.png"
                    alt="mercado-pago"
                  />
                }
              />
            </div>
          </>
=======
>>>>>>> 690f2eb4d50eab6e90988beada90cd7c5c27a7c9
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
                    src="https://img.icons8.com/color/96/hourglass.png"
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
              src="https://img.icons8.com/pulsar-color/96/mail.png"
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
                  width="60"
                  height="60"
                  src="https://img.icons8.com/parakeet/96/control-panel.png"
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
