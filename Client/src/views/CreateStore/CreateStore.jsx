import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import style from "./CreateStore.module.css";
import Swal from "sweetalert2";
import { uploadFile } from "../../components/Firebase/config";
import { validateStoreForm } from "./validations";
import Head from '../../components/Head/Head'
import { socket } from "../../App";

const CreateStore = ({ userData }) => {
  const navigate = useNavigate();
  const [showFacebookInput, setShowFacebookInput] = useState(false);
  const [showInstagramInput, setShowInstagramInput] = useState(false);
  const [showWhatsappInput, setShowWhatsappInput] = useState(false);
  const [imageFile, setImageFile] = useState(null);
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
        navigate("/more");
        socket?.emit("waitingStore", storeData)
        Swal.fire({
          icon: "success",
          title: `Tienda en Processo de Aprobacion!`,
          text: "Debes esperar que tu tienda sea aprobada, nosotros te avisaremos por mail!",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <Head />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className={style.container}
      >
        <h3>Crear tienda</h3>

        <form className={style.create}>
          <div className={style.part1}>
            <div className={style.nombre}>
              <p>Nombre de la tienda</p>
              <input
                className={style.input}
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ej: Ferreteria Manolo"
              />
              {errors.nombre && (
                <span className={style.error}>{errors.nombre}</span>
              )}
            </div>

            <div className={style.calle}>
              <p>Calle</p>
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
            </div>

            <div className={style.numero}>
              <p>Numero de Casa</p>
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
            </div>

            <div className={style.pisoDto}>
              <p>Piso/Departamento</p>
              <input
                className={style.inputCheck}
                type="checkbox"
                name="pisoDeptoChecked"
                checked={formData.pisoDeptoChecked}
                onChange={handleChange}
              />
            </div>

            {formData.pisoDeptoChecked && (
              <>
                <div className={style.piso}>
                  <p>Piso</p>
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
                </div>
                <div className={style.dto}>
                  <p>Depto</p>
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
                </div>
              </>
            )}

            <div className={style.extra}>
              <p>Indicaciones Extra</p>
              <input
                className={style.input}
                type="textarea"
                name="indicaciones"
                value={formData.indicaciones}
                onChange={handleChange}
                placeholder="Ej: Casa roja con porton negro"
              />
            </div>
          </div>
          <div className={style.part2}>
            <div className={style.categoria}>
              <p>Categoría</p>
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
            </div>
            <div className={style.horarios}>
              <p>Horarios (formato: número - número)</p>
              <input
                className={style.input}
                type="text"
                name="horarios"
                value={formData.horarios}
                onChange={handleChange}
                placeholder="Ej: 9 - 5"
              />
              {errors.horarios && (
                <span className={style.error}>{errors.horarios}</span>
              )}
            </div>

            <div className={style.dias}>
              <p>Dias (formato: dia - dia)</p>
              <input
                className={style.input}
                type="text"
                name="dias"
                value={formData.dias}
                onChange={handleChange}
                placeholder="Ej: lunes - viernes"
              />
            </div>

            <div className={style.face}>
              <p>Facebook</p>
              <input
                type="checkbox"
                checked={showFacebookInput}
                onChange={() => handleCheckboxChange("facebook")}
              />
            </div>

            {showFacebookInput && (
              <div className={style.faceIn}>
                <p>Facebook URL</p>
                <input
                  type="text"
                  name="facebook"
                  value={formData.facebook}
                  onChange={handleChange}
                  placeholder="Ej: https://www.facebook.com/tu_pagina"
                />
                {errors.facebook && (
                  <span className={style.error}>{errors.facebook}</span>
                )}
              </div>
            )}

            <div className={style.insta}>
              <p>Instagram</p>
              <input
                type="checkbox"
                checked={showInstagramInput}
                onChange={() => handleCheckboxChange("instagram")}
              />
            </div>

            {showInstagramInput && (
              <div className={style.instaIn}>
                <p>Instagram URL</p>
                <input
                  type="text"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleChange}
                  placeholder="Ej: https://www.instagram.com/tu_cuenta"
                />
                {errors.instagram && (
                  <span className={style.error}>{errors.instagram}</span>
                )}
              </div>
            )}

            <div className={style.whats}>
              <p>Whatsapp</p>
              <input
                type="checkbox"
                checked={showWhatsappInput}
                onChange={() => handleCheckboxChange("whatsapp")}
              />
            </div>

            {showWhatsappInput && (
              <div className={style.whatsIn}>
                <p>WhatsApp URL</p>
                <input
                  type="text"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  placeholder="Ej: https://wa.me/1234567890"
                />
                {errors.whatsapp && (
                  <span className={style.error}>{errors.whatsapp}</span>
                )}
              </div>
            )}

            <div className={style.foto}>
              <p>Logo tienda</p>
              <input
                type="file"
                accept="image/*"
                name="image"
                onChange={handleFile}
              />
              {errors.image && (
                <span className={style.error}>{errors.image}</span>
              )}
              {formData.image && (
                <div className={style.imagePreview}>
                  <img
                    src={formData.image}
                    alt="Preview"
                    className={style.imgUser}
                  />
                  <button onClick={handleImageClear}>x</button>
                </div>
              )}
            </div>
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
