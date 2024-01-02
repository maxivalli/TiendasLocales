import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import style from "./ResetPassword.module.css";
import axios from "axios";
import { validatePassw, validateRepeat } from "./validations";
import Swal from "sweetalert2";
import Logo from "../../assets/logo.png";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [input, setInput] = useState({
    password: "",
    codigo:""
  });
  const [codigoVerificacion, setCodigoVerificacion] = useState(false);



  const [error, setError] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput({
      ...input,
      [name]: value,
    });
    if (name === "password") {
      setError({ ...error, password: validatePassw(value) });
    } else if (name === "passwordRepeat") {
      setError({
        ...error,
        passwordRepeat: validateRepeat(value, input.password),
      });
    }
  };

  const handleCodeSubmit = async (event) => {
    event.preventDefault();

    await axios
      .get(`/codes/codigoForgot/${input.codigo}`)
      .then((res) => {
        if (res.data) {
          Swal.fire({
            icon: "success",
            title: "Codigo verificado con exito",
            text: "Aprete " + "aceptar" + " para continuar",
          }).then(() => {
            setCodigoVerificacion(true)
        })
        } else {
          Swal.fire({
            icon: "denied",
            title: "Codigo incorrecto",
            text: "Revise el codigo e intente nuevamente",
          })
        }
      })
      .catch((err) => console.log(err));
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    if (error.password || error.passwordRepeat) {
      return;
    }
    await axios
      .post(`/users/reset-password/${id}`, { password: input.password })
      .then((res) => {
        if (res.data) {
          Swal.fire({
            icon: "success",
            title: "Registro de nueva contraseña exitoso",
            text: "¡Inicie sesion con su nueva contraseña!",
          }).then(() => {
          navigate("/");
        })
        }
      })
      .catch((err) => console.log(err));
  };

  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  function isSubmitDisabled() {
    return Object.values(error).some((error) => error !== null);
  }

  return (
    <div className={style.view}>
      <div className={style.container}>
        <img src={Logo} className={style.logo} />
        <div className={style.title}>
          <h2>Cambiar contraseña</h2>
        </div>

        <div className={style.form}>
          {!codigoVerificacion && (
            <form onSubmit={handleCodeSubmit}>
              <div className={style.sI}>
                <input
                  type="text"
                  name="codigo"
                  placeholder="codigo"
                  value={input.code}
                  onChange={handleChange}
                  className={style.input}
                />
              </div>
              <button
                  type="submit"
                >
                  Verificar
                </button>
            </form>
          )}
          {codigoVerificacion && (
            <form onSubmit={handleSubmit}>
              <div className={style.sI}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Contraseña"
                  value={input.password}
                  onChange={handleChange}
                  className={style.input}
                />
                {error.password && (
                  <span className={style.error}>{error.password}</span>
                )}
                <input
                  type={showPassword ? "text" : "password"}
                  name="passwordRepeat"
                  placeholder="Repetir contraseña"
                  onChange={handleChange}
                  value={input.passwordRepeat}
                  className={style.segundoInput}
                />
                {error.passwordRepeat && (
                  <span className={style.error}>{error.passwordRepeat}</span>
                )}
                <div className={style.showP}>
                  <label>Ver contraseñas</label>
                  <input
                    type="checkbox"
                    id="showPassword"
                    onChange={handleShowPassword}
                    checked={showPassword}
                  />
                </div>
              </div>
              <div>
                <button
                  className={
                    isSubmitDisabled()
                      ? `${style.register} ${style.buttonDisabled}`
                      : style.register
                  }
                  disabled={isSubmitDisabled()}
                  type="submit"
                >
                  Enviar
                </button>
                <div className={style.registerLink}>¿No tiene una cuenta?</div>
                <Link to="/register" className={style.textYellow}>
                  <button className={style.btnAqui}>Regístrate</button>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
