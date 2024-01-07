import { useState } from "react";
import style from "./Footer.module.css";

const Footer = () => {
  const [isColapsed, setIsColapsed] = useState(true);

  const toggleFooter = () => {
    setIsColapsed(!isColapsed);
  };

  return (
    <>
      <button onClick={toggleFooter} className={style.toggle}>
        {isColapsed ? (
          <img
            width="24"
            height="24"
            src="https://img.icons8.com/color/48/collapse-arrow.png"
            alt="collapse-arrow"
          />
        ) : (
          <img
            width="24"
            height="24"
            src="https://img.icons8.com/color/48/expand-arrow.png"
            alt="expand-arrow"
          />
        )}
      </button>
      <div className={`${style.footer} ${isColapsed ? style.expanded : ""}`}>
        <div className={style.left}>
          <h3>Acerca de</h3>
          <p>Terminos y condiciones</p>
          <p>Nosotros</p>
          <p>Preguntas Frecuentes</p>
        </div>

        <div className={style.right}>
          <h3>Contacto</h3>
          <a href="https://www.instagram.com/tiendaslocalesSC/" target="_blank">
            <img
              width="24"
              height="24"
              src="https://img.icons8.com/color-glass/48/instagram-new--v1.png"
              alt="instagram-new--v1"
            />
            Instagram
          </a>
          <a href="mailto:sancristobal@tiendaslocales.com.ar">
            <img
              width="24"
              height="24"
              src="https://img.icons8.com/color/48/apple-mail.png"
              alt="apple-mail"
            />
            Mail de contacto
          </a>
        </div>
        <div className={style.center}>
          <h3>Desarrollada por</h3>
          <div className={style.ab}>
            <div className={style.a}>
              <a href="https://github.com/maxivalli" target="_blank">
                Maximiliano Valli
              </a>

              <a href="https://github.com/DoutNik" target="_blank">
                Carlos Emanuel Klema
              </a>

              <a href="https://github.com/SantinoMantineo" target="_blank">
                Santino Mantineo
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className={style.bottom}>
        <p>Tiendas Locales © - Todos los derechos registrados - 2024</p>
      </div>
    </>
  );
};

export default Footer;
