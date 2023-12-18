import Logo from '../../assets/logo.png'
import React, { useState, useEffect } from "react";
import Head from '../../components/Head/Head'
import style from "./Register.module.css";
import axios from "axios";
import { validateUsername, validateEmail, validatePassword, validateImagen, validatePasswordRepeat } from "./validations";
import Swal from 'sweetalert2';
import { uploadFile } from '../Firebase/config';

const Register = ({setAuth}) => {

  const [imageError, setImageError] = useState(null);

  const [errors, setErrors] = useState({
    nombre: null,
    apellido: null,
    password: null,
    email: null,
    image: null,
  });
  

  const [input, setInput] = useState({
    nombre: "",
    apellido: "",
    password: "",
    repeatPassword: "",
    email: "",
    image: "",
    imageFile: null,
    disabled: false,
  });

  const [imageFile, setImageFile] = useState(null);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInput({
      ...input,
      [name]: value,
    });

    if (name === 'nombre') {
      setErrors({ ...errors, username: validateUsername(value) });
    } else if (name === "apellido"){
      setErrors({ ...errors, username: validateUsername(value) });
    } else if (name === 'email') {
      setErrors({ ...errors, email: validateEmail(value) });
    } else if (name === 'password') {
      setErrors({ ...errors, password: validatePassword(value) });
    } else if (name === 'repeatPassword') {
      setErrors({
        ...errors,
        repeatPassword: validatePasswordRepeat(value, input.password),
      });    
    } else if (name === 'image') {
      setErrors({ ...errors, image: validateImagen(value) });
    }
  };


  const [showPassword, setShowPassword] = useState(false);
    
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleFile = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = await uploadFile(file)
      setInput({
        ...input,
        image: imageUrl,
      });
      setImageFile(imageUrl); 
      setImageError(null)
    }
  };
  
  const handleImageClear = () => {
    setInput({
      ...input,
      image: '',
    });
    setImageFile(null);
  };



  const handleSumbit = async (e) => {
  e.preventDefault();
  setInput({
    ...input,
    disabled: true})

  if (
    !input.nombre ||
    !input.apellido ||
    !input.email ||
    !input.password ||
    !input.repeatPassword ||
    !input.image
  )   
  {
 
    
  if (!input.image) {
    setImageError('Es necesario completar con una imagen.');
  } else {
    setImageError(null); 
  }

  Swal.fire({
    icon: 'info',
    title: 'Campos incompletos',
    html: 'Todos los campos son obligatorios para completar el registro'
  });
    
    setInput({
      ...input,
      disabled: false,
    });
    return;
  }

  try {

    let newUser = {
      username: `${input.nombre} ${input.apellido}`,
      password: input.password,
      email: input.email,
      image: imageFile,
      origin: "DB"
    };

    const response = await axios.post('/users/register', newUser);

    if (response) {
      await localStorage.setItem('token', response.data.token);
      setAuth(true);

      // Mostrar una alerta de éxito
      Swal.fire({
        icon: 'success',
        title: 'Registro exitoso',
        text: '¡Te has registrado exitosamente!',
      });
    } else {
      console.log('Hubo un error al crear el usuario.');
    }
  } catch (error) {
    console.error('Error al enviar los datos al servidor:', error);
    console.log('Hubo un error al crear el usuario.');

    if (error.response && error.response.data === 'El email ya se encuentra registrado') {
      Swal.fire({
        icon: 'warning',
        title: 'Email en uso',
        text: 'El correo electrónico ya está en uso. Por favor, elige otro.',
      });
    } else if (error.response && error.response.data === 'El nombre de usuario ya se encuentra registrado') {
      Swal.fire({
        icon: 'warning',
        title: 'Nombre de usuario en uso',
        text: 'El nombre de usuario ya está en uso. Por favor, elige otro.',
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error al registrar',
        text: 'Hubo un error al registrar el usuario. Por favor, inténtalo de nuevo.',
      });
    }

    setInput({
      ...input,
      disabled: false,
    });
    return;
  }

  setInput({
    nombre: '',
    apellido: '',
    password: '',
    repeatPassword: '',
    email: '',
    image: '',
    imageFile: null,
    disabled: false,
  });
};

  function isSubmitDisabled() {
    return Object.values(errors).some((error) => error !== null);
  }

  return (
    <>
    <div className={style.view}>
    <div className={style.container}>
      <img src={Logo} className={style.logo}/>
      <div className={style.title}>
        <h2>Regístrate</h2>
      </div>

      <div className={style.form}>
        <form onSubmit={handleSumbit}>
          <div>
            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              onChange={handleInputChange}
              value={input.username}
              disabled={input.disabled}
            />
             {errors.nombre && <span className={style.error}>{errors.nombre}</span>}
          </div>
          <div>
            <input
              type="text"
              name="apellido"
              placeholder="Apellido"
              onChange={handleInputChange}
              value={input.apellido}
              disabled={input.disabled}
            />
             {errors.apellido && <span className={style.error}>{errors.apellido}</span>}
          </div>
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleInputChange}
              value={input.email}
              disabled={input.disabled}
            />
            {errors.email && <span className={style.error}>{errors.email}</span>}
          </div>

          <div>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Contraseña"
              onChange={handleInputChange}
              value={input.password}
              disabled={input.disabled}
            />
            {/* <input
              type="checkbox"
              id="showPassword"
              onChange={handleShowPassword}
              checked={showPassword}
            /> */}
            {errors.password && <span className={style.error}>{errors.password}</span>}
          </div>
          <div>
          <input
            type="password"
            name="repeatPassword"
            placeholder="Repetir contraseña"
            onChange={handleInputChange}
            value={input.repeatPassword} // Asegúrate de tener un valor inicial en el estado
            disabled={input.disabled}
          />
            {errors.repeatPassword && <span className={style.error}>{errors.repeatPassword}</span>}
        </div>
            {/* <input
              type="checkbox"
              id="showPassword"
              onChange={handleShowPassword}
              checked={showPassword}
            /> */}
        <div className={style.fileInput} disabled={input.disabled}>
          <input
            type="file"
            accept="image/*"
            name="image"
            onChange={handleFile}
          />
          {input.image && (
            <div className={style.imagePreview}>
              <img src={input.image} alt="Preview" className={style.imgUser}/>
              <button onClick={handleImageClear}>x</button>
            </div>
          )}
          {/* {errors.image && <span className={style.error}>{errors.image}</span>} */}
          {imageError && <div className={style.error}>{imageError}</div>}
        </div>
       
          <button className={isSubmitDisabled() ? `${style.register} ${style.buttonDisabled}` : style.register} disabled={isSubmitDisabled()} type="submit">
            Enviar
          </button>
          {input.disabled && <div className={style.loaderContainer}>
            <span>Creando usuario...</span>
            <div className={style.loader}></div>
          </div>}
        </form>
      </div>
    </div>
    </div>
    </>
  );
};

export default Register;