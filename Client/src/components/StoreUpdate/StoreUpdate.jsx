import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import style from "./StoreUpdate.module.css"
import Swal from "sweetalert2";
import { validateStoreForm } from "./validations";
import { uploadFile } from "../../components/Firebase/config";


const StoreUpdate = ({ storeId }) => {
  const [showFacebookInput, setShowFacebookInput] = useState(false);
  const [showInstagramInput, setShowInstagramInput] = useState(false);
  const [showWhatsappInput, setShowWhatsappInput] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  const categories = [
    "🪇 Arte y artesanías",
    "☕️ Cafeterías",
    "🚧 Construcción",
    "📺 Electrodomésticos",
    "💻 Electrónica",
    "💊 Farmacias y perfumerías",
    "🍦 Heladerías",
    "🛠️ Herramientas",
    "🎸 Instrumentos musicales",
    "💍 Joyas y relojes",
    "🍭 Kioscos y almacenes",
    "🪑 Muebles y hogar",
    "🍰 Panaderia y reposteria",
    "🍕 Rotisería y restaurantes",
    "🛍️ Regalería",
    "👕 Ropa e indumentaría",
    "🚗 Vehículos",
    "🛒 Sin categoría",
  ];

  const handleCheckboxChange = (socialMedia) => {
    switch (socialMedia) {
      case "facebook":
        setShowFacebookInput(!showFacebookInput);
        break;
      case "instagram":
        setShowInstagramInput(!showInstagramInput);
        break;
      case "whatsapp":
        setShowWhatsappInput(!showWhatsappInput);
        break;
      default:
        break;
    }
  };

  const [storeData, setStoreData] = useState({
    nombre: "",
    image: "",
    calle: "",
    numero: "",
    pisoDeptoChecked: false,
    piso: "",
    depto: "",
    indicaciones: "",
    categoria: "",
    horarios: "",
    dias: "",
    facebook: "",
    instagram: "",
    whatsapp: "",
  });
  const [errors, setErrors] = useState({
    calle: "",
    numero: "",
    piso: "",
    depto: "",
    nombre: "",
    categoria: "",
    horarios: "",
    dias: "",
    facebook: "",
    instagram: "",
    whatsapp: "",
    image: "",
  });

  useEffect(() => {
    storeData.categoria = selectedCategory;
  }, [selectedCategory]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setStoreData({ ...storeData, [name]: checked });
    } else {
      setStoreData({ ...storeData, [name]: value });
    }
    const newErrors = validateStoreForm({ ...storeData, [name]: value });
    setErrors({ ...errors, [name]: newErrors[name] || "" });
  };

  const handleFile = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = await uploadFile(file);
      setStoreData({
        ...storeData,
        image: imageUrl,
      });
    }
  };

  const handleImageClear = () => {
    setStoreData({
      ...storeData,
      image: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formErrors = validateStoreForm(storeData);

    if (Object.values(formErrors).some((error) => error)) {
      setErrors(formErrors);
      console.log(formErrors);
      return
    }

    let updatedStoreData = { ...storeData };

    if (storeData.calle !== "" || storeData.numero !== "" || storeData.depto !== "" || storeData.piso !== "") {
      updatedStoreData.direccion = {
        ...updatedStoreData.direccion,
        calle: storeData.calle,
        numero: storeData.numero,
        piso: storeData.piso,
        depto: storeData.depto
      };
    } else {
      delete updatedStoreData.direccion;
    }
  
    Object.keys(updatedStoreData).forEach(
      (key) =>
        (updatedStoreData[key] === "" || updatedStoreData[key] === null) &&
        delete updatedStoreData[key]
    );

    try {
      const response = await axios.put(`/tiendas/updateStore/${storeId}`, updatedStoreData);
      if (response) {
        Swal.fire({
          icon: "success",
          title: `Tienda actualizada con exito!`,
          text: "Echale un vistazo para comprobar que haya quedado bien!",
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
        <h3>Actualizar datos de tienda</h3>
        <form className={style.create}>
          <div className={style.part1}>
            <label>
              Nombre de la tienda
              <input
                className={style.input}
                type="text"
                name="nombre"
                value={storeData.nombre}
                onChange={handleChange}
                placeholder="Ej: Ferreteria Manolo"
              />
              {errors.nombre && (
                <span className={style.error}>{errors.nombre}</span>
              )}
            </label>
          </div>

          <div className={style.part1}>
            <label>
              Calle
              <input
                className={style.input}
                type="text"
                name="calle"
                value={storeData.calle}
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
              Numero (altura de calle)
              <input
                className={style.input}
                type="text"
                name="numero"
                value={storeData.numero}
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
              Piso/Numero de local
              <input
                className={style.inputCheck}
                type="checkbox"
                name="pisoDeptoChecked"
                checked={storeData.pisoDeptoChecked}
                onChange={handleChange}
              />
            </label>
          </div>

          {storeData.pisoDeptoChecked && (
            <>
              <div className={style.part1}>
                <label>
                  Piso
                  <input
                    className={style.input}
                    type="text"
                    name="piso"
                    value={storeData.piso}
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
                  N° de local
                  <input
                    className={style.input}
                    type="text"
                    name="depto"
                    value={storeData.depto}
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
              Categoria
              <select
                name="categoria"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="Elige una categoría">Categoría</option>
                {categories.map((categoria, index) => (
                  <option key={index} value={categoria}>
                    {categoria}
                  </option>
                ))}
              </select>
              {errors.categoria && (
                <span className={style.error}>{errors.categoria}</span>
              )}
            </label>
          </div>

          <div className={style.part1}>
            <label>
              Horarios (formato: número - número)
              <input
                className={style.input}
                type="text"
                name="horarios"
                value={storeData.horarios}
                onChange={handleChange}
                placeholder="Ej: 9 - 5"
              />
              {errors.horarios && (
                <span className={style.error}>{errors.horarios}</span>
              )}
            </label>
          </div>

          <div className={style.part1}>
            <label>
              Dias (formato: dia - dia)
              <input
                className={style.input}
                type="text"
                name="dias"
                value={storeData.dias}
                onChange={handleChange}
                placeholder="Ej: lunes - viernes"
              />
            </label>
          </div>

          <div className={style.part1}>
            <label>
              Facebook
              <input
                type="checkbox"
                checked={showFacebookInput}
                onChange={() => handleCheckboxChange("facebook")}
              />
            </label>
          </div>

          {showFacebookInput && (
            <div className={style.part1}>
              <label>
                Facebook URL
                <input
                  type="text"
                  name="facebook"
                  value={storeData.facebook}
                  onChange={handleChange}
                  placeholder="Ej: https://www.facebook.com/tu_pagina"
                />
                {errors.facebook && (
                  <span className={style.error}>{errors.facebook}</span>
                )}
              </label>
            </div>
          )}

          <div className={style.part1}>
            <label>
              Instagram
              <input
                type="checkbox"
                checked={showInstagramInput}
                onChange={() => handleCheckboxChange("instagram")}
              />
            </label>
          </div>

          {showInstagramInput && (
            <div className={style.part1}>
              <label>
                Instagram URL
                <input
                  type="text"
                  name="instagram"
                  value={storeData.instagram}
                  onChange={handleChange}
                  placeholder="Ej: https://www.instagram.com/tu_cuenta"
                />
                {errors.instagram && (
                  <span className={style.error}>{errors.instagram}</span>
                )}
              </label>
            </div>
          )}

          <div className={style.part1}>
            <label>
              Whatsapp
              <input
                type="checkbox"
                checked={showWhatsappInput}
                onChange={() => handleCheckboxChange("whatsapp")}
              />
            </label>
          </div>

          {showWhatsappInput && (
            <div className={style.part1}>
              <label>
                WhatsApp URL
                <input
                  type="text"
                  name="whatsapp"
                  value={storeData.whatsapp}
                  onChange={handleChange}
                  placeholder="Ej: https://wa.me/1234567890"
                />
                {errors.whatsapp && (
                  <span className={style.error}>{errors.whatsapp}</span>
                )}
              </label>
            </div>
          )}

          <div className={style.foto}>
           <label>
            Logo Tienda
            <input
              type="file"
              accept="image/*"
              name="image"
              onChange={handleFile}
              />
            {errors.image && (
                <span className={style.error}>{errors.image}</span>
                )}
            {storeData.image && (
                <div className={style.imagePreview}>
                <img
                  src={storeData.image}
                  alt="Preview"
                  className={style.imgUser}
                  />
                <button onClick={handleImageClear}>x</button>
              </div>
            )}
            </label>
          </div>

        </form>

        <button type="submit" onClick={handleSubmit} className={style.button}>
          Actualizar
        </button>
      </motion.div>
    </>
  );
};

export default StoreUpdate;
