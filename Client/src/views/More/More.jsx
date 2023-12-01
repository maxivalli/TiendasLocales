import React from 'react'
import { Link } from 'react-router-dom'
import CardWide from '../../components/CardWide/CardWide'
import style from './More.module.css'

const More = () => {
  return (
    <>
    <div className={style.more}>
    <CardWide textButton={"Crear Tienda"} logo={<img width="60" height="60" src="https://img.icons8.com/parakeet/96/add-shop.png" alt="add-shop"/>} link={"/createstore"}/>
    <CardWide textButton={"Mi Tienda"} logo={<img width="60" height="60" src="https://img.icons8.com/parakeet/96/online-order.png" alt="online-order"/>} link={"/mystore"} />
    <CardWide textButton={"Consultas"} logo={<img width="60" height="60" src="https://img.icons8.com/pulsar-color/96/mail.png" alt="mail"/>} link={"/queries"} />
    <CardWide textButton={"FAQ"} logo={<img width="60" height="60" src="https://img.icons8.com/pulsar-color/96/seo-text.png" alt="seo-text"/>} link={"/faq"} />
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