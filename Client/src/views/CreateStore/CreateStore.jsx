import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import style from "./CreateStore.module.css";
import Swal from "sweetalert2";
import { uploadFile } from "../../components/Firebase/config";
import { validateStoreForm } from "./validations";



const CreateStore = ({ userData }) => {
  const navigate = useNavigate();
  const [showFacebookInput, setShowFacebookInput] = useState(false);
  const [showInstagramInput, setShowInstagramInput] = useState(false);
  const [showWhatsappInput, setShowWhatsappInput] = useState(false);
  const [imageError, setImageError] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");

  const categories = [
    "🧁 Alimentos",
    "⚱️ Antiguedades",
    "🎨 Arte y artesanías",
    "⚽️ Articulos deportivos",
    "📺 Audio y video",
    "📷 Cámaras y accesorios",
    "📱 Celulares",
    "💻 Computadoras",
    "🔌Electrodomésticos",
    "🛠️ Herramientas",
    "🎸 Instrumentos musicales",
    "💍 Joyas y relojes",
    "🪑 Muebles y hogar",
    "🚗 Rodados con motor",
    "🚲 Rodados sin motor",
    "👕 Ropa e indumentaria",
    "🛒 Varios",
    "🎮 Videojuegos",
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
  const [formData, setFormData] = useState({
    nombre: "",
    image: "",
    imageFile: null,
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
    formData.categoria = selectedCategory;
  }, [selectedCategory]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    const newErrors = validateStoreForm({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: newErrors[name] || "" });
  };

  const handleFile = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = await uploadFile(file);
      setFormData({
        ...formData,
        image: imageUrl,
      });
      setImageFile(imageUrl);
    
    }
  };
  const handleImageClear = () => {
    setFormData({
      ...formData,
      image: "",
    });
    setImageFile(null);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const formErrors = validateStoreForm(formData);

    if (Object.values(formErrors).some((error) => error)) {
      setErrors(formErrors);
      console.log(errors);
      return;
    }

    let storeData = {
      nombre: formData.nombre,
      direccion: `${formData.calle} ${formData.numero}`,
      indicaciones: formData.indicaciones,
      image: imageFile,
      categoria: formData.categoria,
      horarios: formData.horarios,
      userId: userData.id,
      facebook: formData.facebook,
      instagram: formData.instagram,
      whatsapp: formData.whatsapp,
      email: userData.email,
      dias: formData.dias,
    };
    if (formData.pisoDeptoChecked) {
      storeData.piso = formData.piso;
      storeData.depto = formData.depto;
    }

    try {
      const response = await axios.post("/tiendas/createStore", storeData);
      if (response) {
        Swal.fire({
          icon: "success",
          title: `Tienda en Processo de Aprobacion!`,
          text: "Debes esperar a que sea aprobada tu tienda, nosotros te diremos por mail!",
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
              Nombre de la tienda
              <input
                className={style.input}
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ej: Ferreteria Manolo"
              />
             {errors.nombre && <span className={style.error}>{errors.nombre}</span>}
            </label>
          </div>

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
              {errors.calle && <span className={style.error}>{errors.calle}</span>}

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
             {errors.numero && <span className={style.error}>{errors.numero}</span>}

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
                               {errors.piso && <span className={style.error}>{errors.piso}</span>}

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
                  {errors.depto && <span className={style.error}>{errors.depto}</span>}

                </label>
              </div>
            </>
          )}

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
          {errors.categoria && <span className={style.error}>{errors.categoria}</span>}


          <div className={style.part1}>
            <label>
              Horarios (formato: número - número)
              <input
                className={style.input}
                type="text"
                name="horarios"
                value={formData.horarios}
                onChange={handleChange}
                placeholder="Ej: 9 - 5"
              />
                           {errors.horarios && <span className={style.error}>{errors.horarios}</span>}

            </label>
          </div>

          <div className={style.part1}>
            <label>
              Dias (formato: dia - dia)
              <input
                className={style.input}
                type="text"
                name="dias"
                value={formData.dias}
                onChange={handleChange}
                placeholder="Ej: lunes - viernes"
              />
            </label>
          </div>

          <div className={style.checkboxContainer}>
            <label>
              Facebook
              <input
                type="checkbox"
                checked={showFacebookInput}
                onChange={() => handleCheckboxChange("facebook")}
              />
            </label>
            {showFacebookInput && (
              <div className={style.socialMediaInput}>
                <label>
                  Facebook URL
                  <input
                    type="text"
                    name="facebook"
                    value={formData.facebook}
                    onChange={handleChange}
                    placeholder="Ej: https://www.facebook.com/tu_pagina"
                  />
                               {errors.facebook && <span className={style.error}>{errors.facebook}</span>}

                </label>
              </div>
            )}
          </div>

          <div className={style.checkboxContainer}>
            <label>
              Instagram
              <input
                type="checkbox"
                checked={showInstagramInput}
                onChange={() => handleCheckboxChange("instagram")}
              />
            </label>
            {showInstagramInput && (
              <div className={style.socialMediaInput}>
                <label>
                  Instagram URL
                  <input
                    type="text"
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleChange}
                    placeholder="Ej: https://www.instagram.com/tu_cuenta"
                  />
                               {errors.instagram && <span className={style.error}>{errors.instagram}</span>}

                </label>
              </div>
            )}
          </div>

          <div className={style.checkboxContainer}>
            <label>
              WhatsApp Del Negocio
              <input
                type="checkbox"
                checked={showWhatsappInput}
                onChange={() => handleCheckboxChange("whatsapp")}
              />
            </label>
            {showWhatsappInput && (
              <div className={style.socialMediaInput}>
                <label>
                  WhatsApp URL
                  <input
                    type="text"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    placeholder="Ej: https://wa.me/1234567890"
                  />
                               {errors.whatsapp && <span className={style.error}>{errors.whatsapp}</span>}

                </label>
              </div>
            )}
          </div>

          <div className={style.fileInput}>
            <input
              type="file"
              accept="image/*"
              name="image"
              onChange={handleFile}
              />
              {errors.image && <span className={style.error}>{errors.image}</span>}
            {formData.image && (
              <div className={style.imagePreview}>
                <img
                  src={formData.image}
                  alt="Preview"
                  className={style.imgUser}
                />
                <button onClick={handleImageClear}>✖️</button>
              </div>
            )}
            

          </div>

        </form>

        <button type="submit" onClick={handleSubmit} className={style.button}>
          Enviar
        </button>
      </motion.div>
    </>
  );
};

export default CreateStore;
