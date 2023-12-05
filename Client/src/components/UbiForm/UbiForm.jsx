import React, {useState, useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {motion} from 'framer-motion';
import style from "./ubiForm.module.css";

const UbiForm = () => {
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        calle: "",
        numero: "",
        celular: "",
        indicaciones: ""
      });

      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) =>{
        e.preventDefault();
        let ubicationData = {
            direccion: `${formData.calle, formData.numero}`,
            celular: formData.celular,
            indicaciones: formData.indicaciones
        }
        
        console.log(ubicationData)
    } 
  return (
    <>
    <motion.div
      initial={{opacity: 0,scale: 0.8,}} animate={{opacity: 1, scale: 1,}}
      className={style.container}>

        <h3>Tu direccion para envios</h3>
        <form className={style.create}>
          <div className={style.part1}>
            <label>
              Calle
              <input
                className={style.input}
                type='text'
                name='calle'
                value={formData.calle}
                onChange={handleChange}
                placeholder='Ej necochea'
              />
            </label>
          </div>
          <div className={style.part1}>
            <label>
              Numero de Casa
              <input
                className={style.input}
                type='text'
                name='numero'
                value={formData.numero}
                onChange={handleChange}
                placeholder='Ej 2261'
              />
            </label>
          </div>
          <div className={style.part1}>
            <label>
              Numero Celular
              <input
                className={style.input}
                type='text'
                name='celular'
                value={formData.celular}
                onChange={handleChange}
                placeholder='Ej 261 205 3984'
              />
            </label>
          </div>
          <div className={style.part1}>
            <label>
            Indicaciones Extra
              <input
                className={style.input}
                type='text'
                name='indicaciones'
                value={formData.indicaciones}
                onChange={handleChange}
                placeholder='Ej casa roja con porton negro'
              />
            </label>
          </div>
        </form>
        <button onClick={()=>{navigate("/account")}}>Volver</button>
        <button type='submit' onClick={handleSubmit} className={style.button}>
          Crear
        </button>
      </motion.div>
    </>
  );
};

export default UbiForm;