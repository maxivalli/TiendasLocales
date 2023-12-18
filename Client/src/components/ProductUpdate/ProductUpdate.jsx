import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import style from "./ProductUpdate.module.css";
import Swal from "sweetalert2";
import { validateProductForm } from "./validations";
import { uploadFile } from "../../components/Firebase/config";


const ProductUpdate = ({ id }) => {
  const [productData, setProductData] = useState({
    title: "",
    marca: "",
    description: "",
    price: "",
    stock: "",
    delivery: "",
    image: "",
  });
  const [errors, setErrors] = useState({
    title: "",
    marca: "",
    image: "",
    description: "",
    price: "",
    stock: "",
    delivery: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setProductData({ ...productData, [name]: checked });
    } else {
      setProductData({ ...productData, [name]: value });
    }
    const newErrors = validateProductForm({ ...productData, [name]: value });
    setErrors({ ...errors, [name]: newErrors[name] || "" });
  };

  const handleFile = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = await uploadFile(file);
      setProductData({
        ...productData,
        image: imageUrl,
      });
    }
  };

  const handleImageClear = () => {
    setProductData({
      ...productData,
      image: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formErrors = validateProductForm(productData);

    if (Object.values(formErrors).some((error) => error)) {
      setErrors(formErrors);
      console.log(formErrors);
      return "wey valio verga";
    }

    let postData = {};
    Object.keys(productData).forEach((key) => {
      if (productData[key] !== "") {
        postData[key] = productData[key];
      }
    });

    try {
      const response = await axios.put(`/posts/updatePost/${id}`, postData);
      if (response) {
        Swal.fire({
          icon: "success",
          title: `Producto actualizado con exito!`,
          text: "Echale un vistazo para comprobar que haya quedado bien!",
        }).then(() => {
          // Esta función se ejecutará después de que el usuario haga clic en "OK"
          window.location.reload();
      })
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
        <h3>Actualizar datos de producto</h3>
        <form className={style.create}>
          <div className={style.part1}>
            
          <div className={style.title}>
            <label>
              Titulo
              <input
                className={style.input}
                type="text"
                name="title"
                value={productData.title}
                placeholder="Inserte el título del producto"
                onChange={handleInputChange}
              />
              {errors.title && (
                <span className={style.error}>{errors.title}</span>
              )}
            </label>
          </div>

          <div className={style.brand}>
            <label>
              Marca
              <input
                className={style.input}
                type="text"
                name="marca"
                value={productData.marca}
                placeholder="Inserte la marca del producto"
                onChange={handleInputChange}
              />
              {errors.marca && (
                <span className={style.error}>{errors.marca}</span>
              )}
            </label>
          </div>

          <div className={style.price}>
            <label>
              Precio
              <input
                className={style.input}
                type="text"
                name="price"
                value={productData.price}
                placeholder="Inserte el precio del producto"
                onChange={handleInputChange}
              />
              {errors.price && (
                <span className={style.error}>{errors.price}</span>
              )}
            </label>
          </div>
          </div>

          <div className={style.part2}>
          <div className={style.stock}>
            <label>
              Stock
              <input
                className={style.input}
                type="text"
                name="stock"
                value={productData.depto}
                placeholder="Inserte la cantidad disponible"
                onChange={handleInputChange}
              />
              {errors.stock && (
                <span className={style.error}>{errors.stock}</span>
              )}
            </label>
          </div>

          <div className={style.desc}>
            <label>
              Descripcion
              <input
                className={style.input}
                id="description"
                name="description"
                value={productData.description}
                onChange={handleInputChange}
                placeholder="Inserte una breve descripción"
                required
              />
              {errors.description && (
                <span className={style.error}>{errors.description}</span>
              )}
            </label>
          </div>

          <div className={style.delivery}>
            <p>Tiene envío a domicilio</p>
            <input
              type="checkbox"
              name="delivery"
              value={productData.delivery}
              onChange={handleInputChange}
              required
            />
            {errors.delivery && (
              <span className={style.error}>{errors.delivery}</span>
            )}
          </div>

          <div className={style.images}>
            <label>
              Imagenes
              <input
                type="file"
                accept="image/*"
                name="image"
                onChange={handleFile}
              />
              {errors.image && (
                <span className={style.error}>{errors.image}</span>
              )}
              {productData.image && (
                <div className={style.imagePreview}>
                  <img
                    src={productData.image}
                    alt="Preview"
                    className={style.imgUser}
                  />
                  <button onClick={handleImageClear}>x</button>
                </div>
              )}
            </label>
            </div>
          </div>
        </form>

        <button type="submit" onClick={handleSubmit} className={style.button}>
          Actualizar
        </button>
      </motion.div>
    </>
  );
};

export default ProductUpdate;
