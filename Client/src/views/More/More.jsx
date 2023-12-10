import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import CardWide from '../../components/CardWide/CardWide'
import style from './More.module.css'
import axios from "axios";
import { useSelector } from 'react-redux';

const More = () => {
  const userData = useSelector((state) => state.userData)
  const [ storeData, setStoreData ] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/tiendas/getStore", { params: { id: userData.id } });
        if(response){
          setStoreData(response.data)
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [userData.id]);

  return (
    <>
    <div className={style.section}></div>
    <div className={style.more}>
    {!storeData && <CardWide textButton={"Crear Tienda"} logo={<img width="60" height="60" src="https://img.icons8.com/parakeet/96/add-shop.png" alt="add-shop"/>} link={"/createstore"}/>}
    {(userData.vendedor === "vendedor" && storeData?.habilitado === "habilitado") 
    ? <CardWide textButton={"Mi Tienda"} logo={<img width="60" height="60" src="https://img.icons8.com/parakeet/96/online-order.png" alt="online-order"/>} link={`/store/${storeData.id}`}/> 
    : (storeData && userData.vendedor === "noVendedor" && <CardWide textButton={"En espera"} logo={<img width="60" height="60" src="https://img.icons8.com/color/96/hourglass.png" alt="hourglass"/>}/>)}
    <CardWide textButton={"Consultas"} logo={<img width="60" height="60" src="https://img.icons8.com/pulsar-color/96/mail.png" alt="mail"/>} link={"/queries"} />
    <CardWide textButton={"FAQ"} logo={<img width="60" height="60" src="https://img.icons8.com/pulsar-color/96/seo-text.png" alt="seo-text"/>} link={"/faq"} />
    {userData.rol === "admin" && <CardWide textButton={"Admin Dashboard"} logo={<img width="60" height="60" src="https://img.icons8.com/pulsar-color/96/seo-text.png" alt="seo-text"/>} link={"/dashboard"} />}
    <Link>
    <button className={style.tyc}>Términos y condiciones</button>
    </Link>
    <Link>
    <button className={style.pdp}>Política de privacidad</button>
    </Link>
    </div>
    </>
  )
}

export default More