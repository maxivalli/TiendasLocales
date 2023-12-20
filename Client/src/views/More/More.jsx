import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CardWide from "../../components/CardWide/CardWide";
import Head from "../../components/Head/Head";
import style from "./More.module.css";
import axios from "axios";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

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

  const handleConnectMP = () => {
    // Abrir enlace de Mercado Pago en una nueva pestaña
    window.open(
      `https://auth.mercadopago.com/authorization?client_id=6356168129471214&response_type=code&platform_id=mp&state=${userData.id}&redirect_uri=https://tiendaslocales-production.up.railway.app/tiendas/redirectUrl`
    );

    
    window.location.href = "/#/more";
    Swal.fire({
      icon: "success",
      title: "¡Ya tenés tu tienda conectada a MP!",
      text: "Ve al ícono de más y actualiza la página",
    });
  };

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
            link={`/mystore/${storeData.id}`}
          />
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
                  cuenta de Mercado Pago para poder recibir el dinero.
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
        ) : (
          storeData &&
          userData.vendedor === "noVendedor" &&
          userData.accT && (
            <>
            <div className={style.cenC}>
              <p>
                Para que la tienda sea habilitada deberas pagar<br></br> la
                cuota al centro comercial,<br></br> alli un empleado aprobara tu
                cuenta!
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
