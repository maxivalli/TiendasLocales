import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import style from "./UbiForm.module.css";
import Swal from "sweetalert2";
import { validateAddressForm } from "./validations";

const UbiForm = ({ userData, onAddressAdded }) => {
  const [formData, setFormData] = useState({
    calle: "",
    numero: "",
    celular: "",
    indicaciones: "",
    pisoDeptoChecked: false,
    piso: "",
    depto: "",
  });
  const [errors, setErrors] = useState({
    calle: "",
    numero: "",
    piso: "",
    depto: "",
    celular: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    const newErrors = validateAddressForm({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: newErrors[name] || "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formErrors = validateAddressForm(formData);

    if (Object.values(formErrors).some((error) => error)) {
      setErrors(formErrors);
      return;
    }

    let ubicationData = {
      direccion: `${formData.calle} ${formData.numero}`,
      celular: formData.celular,
      indicaciones: formData.indicaciones,
      id: userData.id,
    };

    if (formData.pisoDeptoChecked) {
      ubicationData.piso = formData.piso;
      ubicationData.depto = formData.depto;
    }

    try {
      const response = await axios.post("/envios/ubiForm", ubicationData);
      if (response) {
        onAddressAdded(ubicationData.direccion);
        Swal.fire({
          icon: "success",
          title: `Direccion agregada!`,
          text: "¡Ya puedes realizar tus pedidos con envio!",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className={style.container}
      >
        <h3>Tú dirección para envíos</h3>
        <form className={style.create}>
          <div className={style.part1}>
            <label>
              Calle
              <input
                className={style.input}
                type="text"
                name="calle"
                value={formData.calle}
                onChange={handleChange}
                placeholder="Ej: Necochea"
              />
              {errors.calle && (
                <span className={style.error}>{errors.calle}</span>
              )}
            </label>
          </div>

          <div className={style.part1}>
            <label>
              Numero de Casa
              <input
                className={style.input}
                type="text"
                name="numero"
                value={formData.numero}
                onChange={handleChange}
                placeholder="Ej: 1900"
              />
              {errors.numero && (
                <span className={style.error}>{errors.numero}</span>
              )}
            </label>
          </div>

          <div className={style.part1}>
            <label>
              Piso/Depto
              <input
                className={style.inputCheck}
                type="checkbox"
                name="pisoDeptoChecked"
                checked={formData.pisoDeptoChecked}
                onChange={handleChange}
              />
            </label>
          </div>

          {formData.pisoDeptoChecked && (
            <>
              <div className={style.part1}>
                <label>
                  Piso
                  <input
                    className={style.input}
                    type="text"
                    name="piso"
                    value={formData.piso}
                    onChange={handleChange}
                    placeholder="Ej: 1"
                  />
                  {errors.piso && (
                    <span className={style.error}>{errors.piso}</span>
                  )}
                </label>
              </div>

              <div className={style.part1}>
                <label>
                  Depto
                  <input
                    className={style.input}
                    type="text"
                    name="depto"
                    value={formData.depto}
                    onChange={handleChange}
                    placeholder='Ej: "A"'
                  />
                  {errors.depto && (
                    <span className={style.error}>{errors.depto}</span>
                  )}
                </label>
              </div>
            </>
          )}

          <div className={style.part1}>
            <label>
              Numero Celular
              <input
                className={style.input}
                type="text"
                name="celular"
                value={formData.celular}
                onChange={handleChange}
                placeholder="Ej: 3408 12345"
              />
              {errors.celular && (
                <span className={style.error}>{errors.celular}</span>
              )}
            </label>
          </div>

          <div className={style.part1}>
            <label>
              Indicaciones Extra
              <input
                className={style.input}
                type="textarea"
                name="indicaciones"
                value={formData.indicaciones}
                onChange={handleChange}
                placeholder='Ej: Piso 1, Dto. "A"'
              />
            </label>
          </div>
        </form>

        <button type="submit" onClick={handleSubmit} className={style.button}>
          Enviar
        </button>
      </motion.div>
    </>
  );
};

export default UbiForm;
