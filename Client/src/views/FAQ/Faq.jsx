import React from "react";
import Head from "../../components/Head/Head";
import style from "./Faq.module.css";

const Faq = () => {
  return (
    <>
      <Head />
      <div className={style.faq}>
        <div className={style.container}>
          <h3>Preguntas frecuentes</h3>

          <details close>
            <summary>¿Cómo puedo comprar un producto en la página?</summary>
            <p>
              Para comprar un producto, localíselo en la página, para tal fin
              puede utilizar el buscador. Una vez que lo encuentre asegúrese de que
              reuna las condiciones que necesite, es decir, si tiene o no envío, precio,
              tamaño u otras características. Si el producto tiene la opción de compra directa
              a través de Mercado Pago, verá un botón que dice "Comprar", si la tienda no 
              acepta ventas a través de MP, verá un botón que dice "Consultar", si presiona
              sobre el, será dirijido a un chat directo donde la tienda podrá informarle los
              medios de pago disponibles.
            </p>
          </details>

          <details close>
            <summary>¿Cualquiera puede crear una tienda?</summary>
            <p>
              Si, cualquier usuario registrado puede crear una tienda. Las
              tiendas están divididas en diferentes categorías, deberá
              seleccionar la que pertenece a su negocio y, si no está disponible,
              puede utilizar la categoría "Otra categoría". Si no tiene una tienda pero
              ofrece algún servicio, como plomería, electricidad u otro, también
              puede crear una tienda para ofrecerlo.
            </p>
          </details>

          <details close>
            <summary>¿Cómo creo una tienda?</summary>
            <p>
              Para crear una tienda deberá ingresar en la sección "más", con el
              botón de los tres puntos, luego presionar el botón de "Crear
              tienda" y completar los campos que solicita el formulario. No
              olvide completar toda la información que se requiera. En lo
              posible tenga a mano un logo o imagen que identifique su tienda,
              los links a sus redes sociales (si posee), y un número de Whatsapp.
              Una vez creada y habilitada la tienda, la información puede
              modificarse si lo necesita.
            </p>
          </details>

          <details close>
            <summary>¿Una vez que creo la tienda que sucede?</summary>
            <p>
              Los datos de su tienda serán enviados al administrador, y si todo está
              correcto será habilitada. Le llegará una notificación y un mail para informarle, 
              si hubiera algún problema con la habilitación también se le informará. Una vez 
              habilitada se le mostrará un botón para tener acceso a la misma.
            </p>
          </details>

          <details close>
            <summary>¿Es obligatorio conectar Mercado Pago?</summary>
            <p>
              Cuando su tienda ya se encuentre habilitada, en el perfil de su tienda
              verá un botón para concectarse a su cuenta de Mercado Pago, si lo desea
              puede conectarla a la plataforma de pagos para poder vender 
              de manera más sencilla en la tienda. Si no lo desea aún puede vender,
              pero deberá enviarle a los usuarios por chat algún medio de pago, tambíen
              puede considerar cobrar contra-entrega.
            </p>
          </details>

          <details close>
            <summary>¿Cómo puedo editar la información de mi tienda?</summary>
            <p>
              Dentro del perfil de la tienda encontrara un botón rojo con tres puntos,
              si presiona sobre el, se desplegarán otros botones. Presione el botón con
              el lápiz y se abrirá un formulario para actualizar sus datos.
            </p>
          </details>

          <details close>
            <summary>¿Cómo publico mis productos?</summary>
            <p>
              Dentro del perfil de la tienda encontrará un botón que dice "Agregar",
              si presiona sobre el, se mostrará un formulario para completar con los 
              datos del producto. De la misma forma que con los datos de su tienda,
              el producto se puede editar posteriormente.
            </p>
          </details>

          <details close>
            <summary>¿Puedo publicar sin precio?</summary>
            <p>
              Si, puede publicar un producto o servicio sin precio, pero debe ingresar
              algún número en el campo, puede utilizar algo simbólico como 111 u otro.
            </p>
          </details>

          <details close>
            <summary>
              ¿Puedo editar un producto para cambiar, por ejemplo, el precio?
            </summary>
            <p>
              Si, en el prefil de su tienda, donde se muestran todos sus productos 
              publicados, verá sobre la tarjeta del producto dos botones, uno para
              editar el producto y otro para borrarlo.
            </p>
          </details>
        </div>
      </div>
    </>
  );
};

export default Faq;
