import Logo from "../../assets/logo.png";
import React, { useState, useEffect } from "react";
import style from "./Login.module.css";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import LoginButton from "../Auth0/LoginButton";

const Login = ({ setAuth }) => {
  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowModal(false);
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const [input, setInput] = useState({
    username: "",
    password: "",
  });

  const [error, setErrors] = useState("");

  const handleInputChange = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const handleSumbit = async (e) => {
    e.preventDefault();

    try {
      let loginUser = {
        username: input.username,
        password: input.password,
      };
      const response = await axios.post("/users/login", loginUser);

      if (response.data && response.data.token) {
        const token = await localStorage.setItem("token", response.data.token);
        setAuth(true);
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener("mouseleave", Swal.resumeTimer);
          },
        });
        Toast.fire({
          icon: "success",
          title: "Login exitoso",
        });
      } else {
        setErrors("Usuario o contraseña incorrectos");
      }
    } catch (error) {
      if (error.response) {
        setErrors(`Error: ${error.response.data.message}`);
      } else if (error.request) {
        setErrors("Error: No response received from server");
      }
      console.error("Error al enviar los datos al servidor:", error);
      setErrors("Usuario o contraseña incorrectos");
    }
  };

  return (
    <>
      {showModal && (
        <div className={style.modal}>
          <img src={Logo} alt="" />
        </div>
      )}
      <div className={style.login}>
        <div className={style.container}>
          <img src={Logo} />
          <div>
            <h2>Iniciar sesión</h2>
          </div>
          <div className={style.form}>
            <form>
              <div>
                <input
                  type="text"
                  name="username"
                  placeholder="Mail"
                  onChange={handleInputChange}
                  value={input.username}
                />
              </div>
              <div>
                <input
                  type="password"
                  name="password"
                  placeholder="Contraseña"
                  onChange={handleInputChange}
                  value={input.password}
                />
              </div>

              {error && <div className={style.error}>{error}</div>}
              <button onClick={handleSumbit} className={style.iniciar}>
                Iniciar sesión
              </button>
            </form>
          </div>

          <div className={style.buttons}>
            <span>
              ¿No tienes una cuenta?
              <Link to="/register" className={style.register}>
                Regístrate
              </Link>
            </span>
          </div>

          <div className={style.buttons}>
            <span>
              o
              <LoginButton />
            </span>
          </div>
          <div className={style.buttons}>
            <span className={style.recover}>
              ¿Olvidaste la contraseña?
              <Link to="/forgotpassword" className={style.register}>
                Recuperar
              </Link>
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
