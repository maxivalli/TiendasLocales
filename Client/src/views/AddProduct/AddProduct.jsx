import React, { useState } from "react";
import axios from "axios";
import Head from "../../components/Head/Head";
import { validateProductForm } from "./validations";

import { uploadFile } from "../../components/Firebase/config";
import style from "./AddProduct.module.css";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const navigate = useNavigate();
  
  const userData = useSelector((state) => state.userData);
  const stores = useSelector((state) => state.allStores);

  const userId = userData?.id;
  const userStore = stores.find((store) => store.userId === userId);
  const storeId = userStore?.id;

  const [newProduct, setNewProduct] = useState({
    title: "",
    marcaChecked: false,
    marca: "",
    image: "",
    description: "",
    price: "",
    stock: "",
    delivery: false,
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
      setNewProduct({ ...newProduct, [name]: checked });
    } else {
      setNewProduct({ ...newProduct, [name]: value });
    }
    const newErrors = validateProductForm({ ...newProduct, [name]: value });
    setErrors({ ...errors, [name]: newErrors[name] || "" });
  };

  const handleFile = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = await uploadFile(file);
      setNewProduct({
        ...newProduct,
        image: imageUrl,
      });
    }
  };
  const handleImageClear = () => {
    setNewProduct({
      ...newProduct,
      image: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formErrors = validateProductForm(newProduct);

    if (Object.values(formErrors).some((error) => error)) {
      setErrors(formErrors);
      return;
    }

    let postData = {
      title: newProduct.title,
      image: newProduct.image,
      description: newProduct.description,
      price: newProduct.price,
      stock: newProduct.stock,
      delivery: newProduct.delivery,
      storeId: storeId,
      userId: userData.id,
    };
    if (newProduct.marcaChecked) {
      postData.marca = newProduct.marca;
    }

    try {
      const response = await axios.post("/posts/createPost", postData);
      if (response) {
        navigate(`/mitienda/${storeId}`);
        Swal.fire({
          icon: "success",
          title: `Producto creado con exito!`,
          text: "Echale un vistazo en tu tienda para comprobar que haya quedado bien!",
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
        <h3>Agregar producto</h3>

        <form className={style.create}>

          <div className={style.part1}>

            <div className={style.title}>
              <p>Titulo</p>
              <input
                type="text"
                id="title"
                name="title"
                value={newProduct.title}
                onChange={handleInputChange}
                placeholder="Inserte el título del producto"
                required
              />
              {errors.title && (
                <span className={style.error}>{errors.title}</span>
              )}
            </div>

            <div className={style.description}>
              <p>Descripcion</p>
              <input
                id="description"
                name="description"
                value={newProduct.description}
                onChange={handleInputChange}
                placeholder="Inserte una breve descripción"
                required
              />
              {errors.description && (
                <span className={style.error}>{errors.description}</span>
              )}
            </div>

            <div className={style.marcaCheck}>
              <p>Tiene marca</p>
              <input
                className={style.inputCheck}
                type="checkbox"
                name="marcaChecked"
                checked={newProduct.marcaChecked}
                onChange={handleInputChange}
              />
            </div>
            {newProduct.marcaChecked && (
              <>
                <div className={style.marca}>
                  <p>Marca del producto</p>
                  <input
                    type="text"
                    id="marca"
                    name="marca"
                    value={newProduct.marca}
                    onChange={handleInputChange}
                    placeholder="Inserte la marca del producto"
                    required
                  />
                  {errors.marca && (
                    <span className={style.error}>{errors.marca}</span>
                  )}
                </div>
              </>
            )}

            <div className={style.delivery}>
              <p>Tiene envío a domicilio</p>
              <input
                type="checkbox"
                id="delivery"
                name="delivery"
                value={newProduct.delivery}
                onChange={handleInputChange}
                required
              />
              {errors.delivery && (
                <span className={style.error}>{errors.delivery}</span>
              )}
            </div>
          </div>

          <div className={style.part2}>

            <div className={style.price}>
              <p>Precio</p>
              <input
                id="price"
                name="price"
                value={newProduct.price}
                onChange={handleInputChange}
                placeholder="Inserte el precio del producto"
                required
              />
              {errors.price && (
                <span className={style.error}>{errors.price}</span>
              )}
            </div>

            <div className={style.stock}>
              <p>Stock</p>
              <input
                id="stock"
                name="stock"
                value={newProduct.stock}
                onChange={handleInputChange}
                placeholder="Inserte la cantidad disponible"
                required
              />
              {errors.stock && (
                <span className={style.error}>{errors.stock}</span>
              )}
            </div>

            <div className={style.foto}>
              <p>Imagenes</p>
              <input
                type="file"
                accept="image/*"
                name="image"
                onChange={handleFile}
              />
              {errors.image && (
                <span className={style.error}>{errors.image}</span>
              )}
              {newProduct.image && (
                <div className={style.imagePreview}>
                  <img
                    src={newProduct.image}
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
          Agregar
        </button>
      </motion.div>
    </>
  );
};

export default AddProduct;
