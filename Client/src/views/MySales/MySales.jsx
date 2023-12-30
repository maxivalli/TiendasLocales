import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { socket } from "../../App";

import Filters from "../../components/Filters/Filters";
import CardSale from "../../components/CardSales/CardSale";
import Head from "../../components/Head/Head";

import style from "./MySales.module.css";
import { setSelectedStore } from "../../redux/actions";

const MySales = () => {
  const dispatch = useDispatch()
  const userData = useSelector((state) => state.userData);
  const stores = useSelector((state) => state.allStores);
  const userStore = stores.find((store) => store.userId === userData.id)
  const users = useSelector((state) => state.allUsers);
  const [comprasData, setCompras] = useState([]);
  const comprasEnviadas = comprasData.filter((item) => item.enviado === true)
  const comprasPorEnviar = comprasData.filter((item) => item.enviado === false)

  useEffect(() => {
    const fetchData = async () => {
      try {
          const response = await axios.get(
            `/tiendas/comprasRecibidas/${userStore?.id}` 
          );
          if (response) {
            setCompras(response.data);
          }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, [userStore]); 
  

  const handleEnviado = async (itemId) =>{
    try{
      const response = await axios.put(`/tiendas/enviado/${itemId}`);
      if(response){
        socket?.emit("productoEnviado", itemId)
       
        return true
      }
    } catch(error){
      console.error("Error fetching data:", error);
    }
  }


  return (
    <>
      <Filters />
      <Head />
      <div className={style.misventas}>
        <h2 className={style.title}>Mis ventas</h2>

        <h3>Pendientes</h3>
        <div className={style.pendientes}>
          {comprasPorEnviar && comprasPorEnviar.map((item, index) => {
            return (
              <CardSale
                key={index}
                id={item?.id}
                image={item?.productImage}
                title={item?.title}
                price={item?.unit_price}
                quantity={item?.quantity}
                delivery={item?.delivery}
                enviado={item?.enviado}
                user={users && users.find((user) => user.id === item?.userId)}
                adress={item?.userDireccion}
                phone={item?.userDireccion.celular}
                fn={()=>{handleEnviado(item?.id)}}
              />
            );
          })}
          {/* <button onClick={() => handleEnviado(1)}>
          HOLA
          </button> */}
        </div>

        <h3>Enviadas o entregadas</h3>
        <div className={style.entregadas}>
        {comprasEnviadas && comprasEnviadas.map((item, index) => {
            return (
              <CardSale
                key={index}
                id={item?.id}
                image={item?.productImage}
                title={item?.title}
                price={item?.unit_price}
                quantity={item?.quantity}
                enviado={item?.enviado}
                delivery={item?.delivery}
                user={users && users.find((user) => user.id === item?.userId)}
                adress={item?.userDireccion}
                phone={item?.userDireccion.celular}
                fn={()=>{handleEnviado(item?.id)}}
              />
              );
            })}
        </div>
      </div>
    </>
  );
};

export default MySales;
