import React from 'react'
import CardSquare from '../CardSquare/CardSquare'
import style from './Cards.module.css'

const Cards = () => {
  return (
    <>
    <div className={style.cards}>
      <CardSquare/>
      <CardSquare/>
      <CardSquare/>
    </div>
    <div className={style.section}></div>
    </>
  )
}

export default Cards