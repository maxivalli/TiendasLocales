import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import style from "./CreateStore.module.css";
import Swal from "sweetalert2";
import { uploadFile } from "../../components/Firebase/config";
import { validateStoreForm } from "./validations";
import Head from "../../components/Head/Head";
import { socket } from "../../App";
import { useSelector } from "react-redux";

const CreateStore = () => {
  const navigate = useNavigate();
  const userData = useSelector((state) => state.userData)
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
    "🛍️ Regalerías",
    "👕 Ropa e indumentaría",
    "🚗 Vehículos",
    "🛒 Otra categoría",
  ];

  const diasSemana = [
    "lunes",
    "martes",
    "miercoles",
    "jueves",
    "viernes",
    "sabado",
    "domingo",
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
    calle: "",
    numero: "",
    pisoDeptoChecked: false,
    piso: "",
    depto: "",
    indicaciones: "",
    categoria: "",
    horario_de_apertura: "",
    horario_de_cierre: "",
    horarioCortado: false,
    horario_de_apertura2: "",
    horario_de_cierre2: "",
    primerDia: "",
    ultimoDia: "",
    diaExcluido: "",
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
    horario_de_apertura: "",
    horario_de_cierre: "",
    horario_de_apertura2: "",
    horario_de_cierre2: "",
    primerDia: "",
    ultimoDia: "",
    diaExcluido: "",
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
    } else if (type === "time") {
      // Actualizar el estado según el nombre del campo (apertura/cierre)
      setFormData({ ...formData, [name]: value });
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
    }
  };
  const handleImageClear = () => {
    setFormData({
      ...formData,
      image: "",
    });
  };

  const generateDayOptions = () => {
    if (formData.primerDia && formData.ultimoDia) {
      const primerDiaIndex = diasSemana.indexOf(formData.primerDia);
      const ultimoDiaIndex = diasSemana.indexOf(formData.ultimoDia);
      const diasEntreSeleccionados =
        ultimoDiaIndex >= primerDiaIndex
          ? diasSemana.slice(primerDiaIndex + 1, ultimoDiaIndex)
          : [
              ...diasSemana.slice(primerDiaIndex),
              ...diasSemana.slice(0, ultimoDiaIndex + 1),
            ];
      return diasSemana.filter((dia) => diasEntreSeleccionados.includes(dia));
    }
    return diasSemana;
  };

  const generarHorario = () => {
    if (formData.primerDia !== "" && formData.ultimoDia !== "") {
      let horarioString = `(De ${formData.primerDia} a ${formData.ultimoDia}`;
      if (formData.diaExcluido !== "") {
        horarioString = `${horarioString} excepto ${formData.diaExcluido})`;
      } else {
        horarioString = `${horarioString})`;
      }
      return horarioString;
    }
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
      direccion: {
        calle: formData.calle,
        numero: formData.numero,
      },
      indicaciones: formData.indicaciones,
      image: formData.image,
      categoria: formData.categoria,
      horarios: {
        horario_de_apertura: formData.horario_de_apertura,
        horario_de_cierre: formData.horario_de_cierre,
      },
      userId: userData.id,
      facebook: formData.facebook,
      instagram: formData.instagram,
      whatsapp: `https://wa.me/+54${formData.whatsapp}`,
      email: userData.email,
      dias: generarHorario(),
    };
    if (formData.pisoDeptoChecked) {
      storeData.piso = formData.piso;
      storeData.depto = formData.depto;
    }
    if (formData.horarioCortado) {
      storeData.horarios.horario_de_apertura2 = formData.horario_de_apertura2;
      storeData.horarios.horario_de_cierre2 = formData.horario_de_cierre2;
    }

    try {
      const response = await axios.post("/tiendas/createStore", storeData);

      if (response) {
        navigate("/mas");
        const data = {storeData, userData}
        socket?.emit("waitingStore", data);
        Swal.fire({
          icon: "success",
          title: `Tienda en Proceso de Aprobación!`,
          text: "¡Debes esperar que tu tienda sea aprobada, nosotros te avisaremos por mail!",
        });
      } else {
        console.log("Hubo un error al crear la tienda.");
      }
    } catch (error) {
      console.error("Error al enviar los datos al servidor:", error);

      if (
        error.response &&
        error.response.data === "Ya existe una tienda con este nombre."
      ) {
        Swal.fire({
          icon: "error",
          title: "Error al crear la tienda",
          text: "Lo sentimos, ya existe una tienda con el mismo nombre",
        });
      }
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
              <p>Horario de apertura</p>
              <input
                className={style.input}
                type="time"
                name="horario_de_apertura"
                value={formData.horario_de_apertura}
                onChange={handleChange}
                placeholder="Enter the duration time in HH:mm"
                pattern="(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]"
              />
              {errors.horarios && (
                <span className={style.error}>{errors.horarios}</span>
              )}
            </div>

            <div className={style.horarios}>
              <p>Horario de cierre</p>
              <input
                className={style.input}
                type="time"
                name="horario_de_cierre"
                value={formData.horario_de_cierre}
                onChange={handleChange}
                placeholder="Enter the duration time in HH:mm"
                pattern="(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]"
              />
              {errors.horarios && (
                <span className={style.error}>{errors.horarios}</span>
              )}
            </div>

            <div className={style.pisoDto}>
              <p>¿Tiene horario cortado?</p>
              <input
                className={style.inputCheck}
                type="checkbox"
                name="horarioCortado"
                checked={formData.horarioCortado}
                onChange={handleChange}
              />
            </div>

            {formData.horarioCortado && (
              <>
                <div className={style.horarios}>
                  <p>Segundo horario de apertura</p>
                  <input
                    className={style.input}
                    type="time"
                    name="horario_de_apertura2"
                    value={formData.horario_de_apertura2}
                    onChange={handleChange}
                    pattern="(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]"
                  />
                  {errors.horario_de_apertura2 && (
                    <span className={style.error}>{errors.horario_de_apertura2}</span>
                  )}
                </div>
                <div className={style.horarios}>
                  <p>Segundo horario de cierre</p>
                  <input
                    className={style.input}
                    type="time"
                    name="horario_de_cierre2"
                    value={formData.horario_de_cierre2}
                    onChange={handleChange}
                    pattern="(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]"
                  />
                  {errors.horario_de_cierre2 && (
                    <span className={style.error}>{errors.horario_de_cierre2}</span>
                  )}
                </div>
              </>
            )}

            <div className={style.dias}>
              <p>Primer día de la semana que abren:</p>
              <select
                name="primerDia"
                value={formData.primerDia}
                onChange={handleChange}
              >
                <option value="">Selecciona un día</option>
                {diasSemana.map((dia) => (
                  <option key={dia} value={dia}>
                    {dia.charAt(0).toUpperCase() + dia.slice(1)}
                  </option>
                ))}
              </select>
              {errors.primerDia && (
                <span className={style.error}>{errors.primerDia}</span>
              )}
            </div>

            <div className={style.dias}>
              <p>Último día de la semana que abren:</p>
              <select
                name="ultimoDia"
                value={formData.ultimoDia}
                onChange={handleChange}
              >
                <option value="">Selecciona un día</option>
                {diasSemana.map((dia) => (
                  <option key={dia} value={dia}>
                    {dia.charAt(0).toUpperCase() + dia.slice(1)}
                  </option>
                ))}
              </select>
              {errors.ultimoDia && (
                <span className={style.error}>{errors.ultimoDia}</span>
              )}
            </div>

            <div className={style.dias}>
              <p>Día a excluir: (Ej: De lunes a viernes, excepto el jueves)</p>
              <select
                name="diaExcluido"
                value={formData.diaExcluido}
                onChange={handleChange}
              >
                <option value="">Selecciona un día</option>
                {generateDayOptions().map((dia) => (
                  <option key={dia} value={dia}>
                    {dia.charAt(0).toUpperCase() + dia.slice(1)}
                  </option>
                ))}
              </select>
              {errors.diaExcluido && (
                <span className={style.error}>{errors.diaExcluido}</span>
              )}
            </div>

            {formData.primerDia !== "" && formData.ultimoDia !== "" && (
              <div>
                <p>Dias abiertos:</p>
                <h4>{generarHorario()}</h4>
              </div>
            )}

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
                <p>Ingrese su numero de telefono sin 0 ni 15</p>
                <input
                  type="text"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  placeholder="Ej: 3408612345"
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
