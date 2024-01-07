import React from 'react'
import Head from '../../components/Head/Head'
import style from './Queries.module.css'

const Queries = () => {
  return (
    <>
    <Head/>
    <div className={style.container}>

      <div className={style.dev}>
        <h3>Informar un problema</h3>

        <div className={style.link}>
        <p>✉️</p>
        <a href='mailto:contacto@tiendaslocales.com.ar' target='blank'>Contactar por mail</a>
        </div>

        <div className={style.link}>
        <p>📱</p>
        <a href='https://wa.me/+543408677294' target='blank'>Contactar por Whatsapp</a>
        </div>

        <div className={style.link}>
        <span>📞</span>
        <p>Teléfono: 03408 - 421234</p>
        </div>

      </div>
      <div className={style.adm}>
      <h3>Contacto con administración</h3>

        <div className={style.link}>
        <p>✉️</p>
        <a href='mailto:sancristobal@tiendaslocales.com.ar' target='blank'>Contactar por mail</a>
        </div>

        <div className={style.link}>
        <p>📱</p>
        <a href='https://wa.me/+543408677294' target='blank'>Contactar por Whatsapp</a>
        </div>

        <div className={style.link}>
        <span>📞</span>
        <p>Teléfono: 03408 - 421234</p>
        </div>

      </div>
    </div>
    </>
  )
}

export default Queries