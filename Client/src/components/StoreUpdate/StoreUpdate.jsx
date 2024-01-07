import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import style from "./StoreUpdate.module.css";
import Swal from "sweetalert2";
import { validateStoreForm } from "./validations";
import { uploadFile } from "../../components/Firebase/config";

const StoreUpdate = ({ storeId }) => {
  const [showFacebookInput, setShowFacebookInput] = useState(false);
  const [showInstagramInput, setShowInstagramInput] = useState(false);
  const [showWhatsappInput, setShowWhatsappInput] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  const categories = [
    "🎨 Arte y artesanías",
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
    horario_de_apertura: "",
    horario_de_cierre: "",
    horarioCortado: false,
    horario_de_apertura2: "",
    horario_de_cierre2: "",
    primerDia: "",
    ultimoDia: "",
    diaExcluido: "",
    dias: "",
    facebook: "",
    instagram: "",
    whatsapp: "",
  });

  const generarHorario = () => {
    if (storeData.primerDia !== "" && storeData.ultimoDia !== "") {
      let horarioString = `De ${storeData.primerDia} a ${storeData.ultimoDia}`;
      if (storeData.diaExcluido !== "") {
        horarioString = `${horarioString} (excepto ${storeData.diaExcluido})`;
      } else {
        horarioString = `${horarioString}`;
      }

      setStoreData((prevStoreData) => ({
        ...prevStoreData,
        dias: horarioString,
      }));
    }
  };

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
    const handleHorarioGeneration = () => {
      if (storeData.primerDia !== "" && storeData.ultimoDia !== "") {
        generarHorario();
      }
    };
    handleHorarioGeneration();
  }, [storeData.primerDia, storeData.ultimoDia, storeData.diaExcluido]);

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

  const generateDayOptions = () => {
    if (storeData.primerDia && storeData.ultimoDia) {
      const primerDiaIndex = diasSemana.indexOf(storeData.primerDia);
      const ultimoDiaIndex = diasSemana.indexOf(storeData.ultimoDia);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formErrors = validateStoreForm(storeData);

    if (Object.values(formErrors).some((error) => error)) {
      setErrors(formErrors);

      return;
    }

    let updatedStoreData = { ...storeData };

    if (storeData.facebook !== "" || storeData.instagram !== "" || storeData.whatsapp !== "") {
      updatedStoreData = {
        ...updatedStoreData,
        facebook: `https://facebook.com/${storeData.facebook}`,
        instagram: `https://instagram.com/${storeData.instagram}`,
        whatsapp: `https://wa.me/${storeData.whatsapp}`,
      };
    }    

    if (
      storeData.calle !== "" ||
      storeData.numero !== "" ||
      storeData.depto !== "" ||
      storeData.piso !== ""
    ) {
      updatedStoreData.direccion = {
        ...updatedStoreData.direccion,
        calle: storeData.calle,
        numero: storeData.numero,
        piso: storeData.piso,
        depto: storeData.depto,
      };
    } else {
      delete updatedStoreData.direccion;
    }

    if (
      storeData.horario_de_apertura !== "" ||
      storeData.horario_de_cierre !== "" ||
      storeData.horario_de_apertura2 !== "" ||
      storeData.horario_de_cierre2 !== ""
    ) {
      updatedStoreData.horarios = {
        ...updatedStoreData.horarios,
        horario_de_apertura: storeData.horario_de_apertura,
        horario_de_cierre: storeData.horario_de_cierre,
        horario_de_apertura2: storeData.horario_de_apertura2,
        horario_de_cierre2: storeData.horario_de_cierre2,
      };
    } else {
      delete updatedStoreData.horarios;
    }

    Object.keys(updatedStoreData).forEach(
      (key) =>
        (updatedStoreData[key] === "" || updatedStoreData[key] === null) &&
        delete updatedStoreData[key]
    );

    try {
      const response = await axios.put(
        `/tiendas/updateStore/${storeId}`,
        updatedStoreData
      );
      if (response) {
        Swal.fire({
          icon: "success",
          title: `Tienda actualizada con exito!`,
          text: "Echale un vistazo para comprobar que haya quedado bien!",
        }).then(() => {
          window.location.reload();
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

          <div className={style.cortado}>
            <p>Piso/Numero de local</p>
            <input
              className={style.inputCheck}
              type="checkbox"
              name="pisoDeptoChecked"
              checked={storeData.pisoDeptoChecked}
              onChange={handleChange}
            />
          </div>

          {storeData.pisoDeptoChecked && (
            <>
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
            </>
          )}

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

          <div className={style.horarios}>
            <label>
              Horario de apertura
              <input
                className={style.input}
                type="time"
                name="horario_de_apertura"
                value={storeData.horario_de_apertura}
                onChange={handleChange}
                placeholder="Enter the duration time in HH:mm"
                pattern="(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]"
              />
              {errors.horario_de_apertura && (
                <span className={style.error}>
                  {errors.horario_de_apertura}
                </span>
              )}
            </label>
          </div>

          <div className={style.horarios}>
            <label>
              Horario de cierre
              <input
                className={style.input}
                type="time"
                name="horario_de_cierre"
                value={storeData.horario_de_cierre}
                onChange={handleChange}
                placeholder="Enter the duration time in HH:mm"
                pattern="(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]"
              />
              {errors.horario_de_cierre && (
                <span className={style.error}>{errors.horario_de_cierre}</span>
              )}
            </label>
          </div>

          <div className={style.cortado}>
            <p>¿Tiene horario cortado?</p>
            <input
              className={style.inputCheck}
              type="checkbox"
              name="horarioCortado"
              checked={storeData.horarioCortado}
              onChange={handleChange}
            />
          </div>

          {storeData.horarioCortado && (
            <>
              <div className={style.horarios}>
                <label>
                  Segundo horario de apertura
                  <input
                    className={style.input}
                    type="time"
                    name="horario_de_apertura2"
                    value={storeData.horario_de_apertura2}
                    onChange={handleChange}
                    pattern="(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]"
                  />
                  {errors.horario_de_apertura2 && (
                    <span className={style.error}>
                      {errors.horario_de_apertura2}
                    </span>
                  )}
                </label>
              </div>

              <div className={style.horarios}>
                <label>
                  Segundo horario de cierre
                  <input
                    className={style.input}
                    type="time"
                    name="horario_de_cierre2"
                    value={storeData.horario_de_cierre2}
                    onChange={handleChange}
                    pattern="(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]"
                  />
                  {errors.horario_de_cierre2 && (
                    <span className={style.error}>
                      {errors.horario_de_cierre2}
                    </span>
                  )}
                </label>
              </div>
            </>
          )}

          <div className={style.dias}>
            <label>
              Primer día de la semana que abren:
              <select
                name="primerDia"
                value={storeData.primerDia}
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
            </label>
          </div>

          <div className={style.dias}>
            <label>
              Último día de la semana que abren:
              <select
                name="ultimoDia"
                value={storeData.ultimoDia}
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
            </label>
          </div>

          <div className={style.dias}>
            <label>
              Día a excluir:
              <select
                name="diaExcluido"
                value={storeData.diaExcluido}
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
            </label>
          </div>

          {storeData.primerDia !== "" && storeData.ultimoDia !== "" && (
            <div>
              <label>Dias abiertos:</label>
              <h4>{storeData.dias}</h4>
            </div>
          )}

          <div className={style.cortado}>
            <input
              type="checkbox"
              checked={showFacebookInput}
              onChange={() => handleCheckboxChange("facebook")}
            />
            <p>Facebook</p>
          </div>

          {showFacebookInput && (
            <label>
              Usuario de Facebook
              <input
                type="text"
                name="facebook"
                value={storeData.facebook}
                onChange={handleChange}
                placeholder='Ingresa tu usuario de Facebook'
                className={style.input}
              />
              {errors.facebook && (
                <span className={style.error}>{errors.facebook}</span>
              )}
            </label>
          )}

          <div className={style.cortado}>
            <input
              type="checkbox"
              checked={showInstagramInput}
              onChange={() => handleCheckboxChange("instagram")}
            />
            <p>Instagram</p>
          </div>

          {showInstagramInput && (
            <label>
              Usuario de Instagram
              <input
                type="text"
                name="instagram"
                value={storeData.instagram}
                onChange={handleChange}
                placeholder='Ingresa tu usuario de Instagram'
                className={style.input}
              />
              {errors.instagram && (
                <span className={style.error}>{errors.instagram}</span>
              )}
            </label>
          )}

          <div className={style.cortado}>
            <input
              type="checkbox"
              checked={showWhatsappInput}
              onChange={() => handleCheckboxChange("whatsapp")}
            />
            <p>Whatsapp</p>
          </div>

          {showWhatsappInput && (
            <label>
              Ingrese su numero de telefono sin 0 ni 15
              <input
                type="text"
                name="whatsapp"
                value={storeData.whatsapp}
                onChange={handleChange}
                placeholder="Ej: 3414875921"
                className={style.input}
              />
              {errors.whatsapp && (
                <span className={style.error}>{errors.whatsapp}</span>
              )}
            </label>
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
