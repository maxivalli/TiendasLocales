import React, {useState, useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {motion} from 'framer-motion';
import style from "./ubiForm.module.css";
import Swal from "sweetalert2";
import { useSelector } from 'react-redux';

const UbiForm = ({userData}) => {
    const navigate = useNavigate()

    const userDataState = useSelector((state) => state.userData)
console.log(userDataState)
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
          direccion: `${formData.calle} ${formData.numero}`,
            celular: formData.celular,
            indicaciones: formData.indicaciones,
            id: userData.id
        }
        console.log(ubicationData)
        try {
            const response = await axios.post("/envios/ubiForm", ubicationData);
            if (response) {
                navigate("/account")
                Swal.fire({
                    icon: "success",
                    title: `Direccion agregada!`,
                    text: "¡Ya puedes realizar tus pedidos con envio!",
                  });
            }
        } catch (error) {
            console.error(error)
        }
    } 
  return (
    <>
    <motion.div
      initial={{opacity: 0,scale: 0.8,}} animate={{opacity: 1, scale: 1,}}
      className={style.container}>

        <h3>Tú dirección para envíos</h3>
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
                placeholder='Ej: Necochea'
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
                placeholder='Ej: 1900'
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
                placeholder='Ej: 3408 12345'
              />
            </label>
          </div>
          <div className={style.part1}>
            <label>
            Indicaciones Extra
              <input
                className={style.input}
                type='textarea'
                name='indicaciones'
                value={formData.indicaciones}
                onChange={handleChange}
                placeholder='Ej: Piso 1, Dto. "A"'
              />
            </label>
          </div>
        </form>
        <button type='submit' onClick={handleSubmit} className={style.button}>
          Enviar
        </button>
      </motion.div>
    </>
  );
};

export default UbiForm;