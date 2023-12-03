import React from 'react'
import avatar from '../../assets/storeAvatar.jpg'
import CardSquare from '../../components/CardSquare/CardSquare'
import Filters from '../../components/Filters/Filters';
import Head from '../../components/Head/Head'
import hambur from "../../assets/hambur.jpg";
import empan from "../../assets/empan.jpg";
import pizza from "../../assets/pizza.jpg";
import style from './Store.module.css'

const Store = () => {
  return (
    
    <>
    <Filters/>
    <Head/>
    <div className={style.store}>

      <div className={style.avatar}>
        <img src={avatar} alt="avatar" />
      </div>

      <div className={style.info}>
        <h2>Pizza Land</h2>
        <p>Av. Libertador</p>
        <p>11:00 a 23:00</p>
        <p>Comidas</p>
      </div>

      <div className={style.info2}>
        <h3>⭐️⭐️⭐️⭐️</h3>
        <div className={style.redes}>
        <button><img width="40" height="40" src="https://img.icons8.com/color/48/facebook-new.png" alt="facebook-new"/></button>
        <button><img width="40" height="40" src="https://img.icons8.com/color/48/whatsapp--v1.png" alt="whatsapp--v1"/></button>
        <button><img width="40" height="40" src="https://img.icons8.com/fluency/48/instagram-new.png" alt="instagram-new"/></button>
        </div>
      </div>

      <div className={style.buttons}>
        <button className={style.chat}><img width="30" height="30" src="https://img.icons8.com/parakeet-line/48/chat.png" alt="chat"/></button>
        <button className={style.nav}><img width="30" height="30" src="https://img.icons8.com/material-outlined/48/near-me.png" alt="near-me"/></button>
      </div>
      
    </div>
    
    <div className={style.store2}>
      <CardSquare image={hambur} title={"Hamburguesa Americana"} price={"$2500"} store={"Pizza Land"}/>
      <CardSquare image={hambur} title={"Hamburguesa Americana"} price={"$2500"} store={"Pizza Land"}/>
      <CardSquare image={hambur} title={"Hamburguesa Americana"} price={"$2500"} store={"Pizza Land"}/>
      <CardSquare image={hambur} title={"Hamburguesa Americana"} price={"$2500"} store={"Pizza Land"}/>
      <CardSquare image={hambur} title={"Hamburguesa Americana"} price={"$2500"} store={"Pizza Land"}/>
      <CardSquare image={hambur} title={"Hamburguesa Americana"} price={"$2500"} store={"Pizza Land"}/>
      <CardSquare image={hambur} title={"Hamburguesa Americana"} price={"$2500"} store={"Pizza Land"}/>
      <CardSquare image={hambur} title={"Hamburguesa Americana"} price={"$2500"} store={"Pizza Land"}/>
      <CardSquare image={hambur} title={"Hamburguesa Americana"} price={"$2500"} store={"Pizza Land"}/>
    </div>
    </>
  )
}

export default Store