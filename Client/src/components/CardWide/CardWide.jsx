import React from 'react'
import { Link } from 'react-router-dom'
import style from './CardWide.module.css'

const CardWide = ({textButton, logo, link}) => {
  return (
    <div className={style.cardWide}>
        {logo}
        <Link to={link}>
        <button>{textButton}</button>
        </Link>
    </div>
  )
}

export default CardWide