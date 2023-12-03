import React from 'react'
import style from './Filters.module.css'

const Filters = () => {
  return (
    <div className={style.filters}>
        <select name="" id="">
            <option value="">Categoría</option>
        </select>
        <select name="" id="">
            <option value="">Precio</option>
        </select>
        <select name="" id="">
            <option value="">Nombre</option>
        </select>
    </div>
  )
}

export default Filters