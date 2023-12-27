import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { validateEmail } from "./validations";
import style from "./ForgotPassword.module.css";
import axios from "axios";
import Swal from "sweetalert2";
import Logo from "../../assets/logo.png";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState({
    email: "",
  });
  const [error, setError] = useState({
    email: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput({
      ...input,
      [name]: value,
    });

    if (name === 'email') {
      setError({ ...error, email: validateEmail(value) });
  };
}

  const handleSubmit = async (event) => {
    event.preventDefault();
    axios
      .post("/users/forgot-password", { email: input.email })
      .then((res) => {
        if (res.data) {
          Swal.fire({
            icon: "success",
            title: "Solicitud de recuperacion de contraseña",
            text: "¡Hemos enviado un link a su correo!. Si no aparece, revise el correo no deseado",
          });
          navigate("/");
        }
      })
      .catch((err) => {
        console.log(err);

      if (err.response && err.response.data.error === "El usuario no existe") {
        Swal.fire({
          icon: 'warning',
          title: 'Email no encontrado',
          text: 'El correo electrónico no corresponde a ningun usuario registrado.',
        });
      }
    })
  };

  function isSubmitDisabled() {
    return Object.values(error).some((error) => error !== null);
  }

  return (
    <div className={style.view}>
      <div className={style.container}>
        <img src={Logo} className={style.logo} />
        <div className={style.title}>
          <h2>Recuperar Contraseña</h2>
        </div>

        <div className={style.form}>
          <form onSubmit={handleSubmit}>
            <div>
              <label className={style.label}>Ingrese su email</label>
              <input
                type="text"
                name="email"
                value={input.email}
                onChange={handleChange}
              />
              {error.email && (
                <span className={style.error}>{error.email}</span>
              )}
            </div>
            <div>
              <button className={isSubmitDisabled() ? `${style.register} ${style.buttonDisabled}` : style.register} disabled={isSubmitDisabled()} type="submit">
            Enviar
          </button>
              <div className={style.registerLink}>¿No tiene una cuenta?</div>
              <Link to="/register" className={style.textYellow}>
                <button className={style.btnAqui}>Regístrate </button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
