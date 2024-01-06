import React from 'react'
import style from './Spinner.module.css'

const Spinner = () => {
  return (
    <div className={style.spinner}>
        <div className={style.bounce1}></div>
        <div className={style.bounce2}></div>
        <div className={style.bounce3}></div>
      </div>
  )
}

export default Spinner