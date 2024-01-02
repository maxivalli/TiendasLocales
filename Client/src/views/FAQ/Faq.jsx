import React from "react";
import Head from '../../components/Head/Head'
import style from "./Faq.module.css";

const Faq = () => {
  return (
    <>
    <Head/>
    <div className={style.faq}>
      <div className={style.container}>
        <h3>Preguntas frecuentes</h3>
        <details close>
          <summary>¿Cualquiera puede crear una tienda?</summary>
          <p>
            Si, cualquier usuario registrado puede crear una tienda. Las tiendas
            están divididas en diferentes categorías, deberá seleccionar la
            catrgoría a la que pertenece su negocio y si no está disponible,
            puede utilizar la categoría "otros". Si no tiene una tienda pero
            ofrece algún servicio, como plomería, electricidad u otro, también
            puede crear una tienda para ofrecer sus servicios.
          </p>
        </details>

        <details close>
          <summary>¿Cómo hago para crear una tienda?</summary>
          <p>
            Para crear una tienda deberá ingresar en la sección "más", con el
            botón de los tres puntos, luego presionar el botón de "Crear tienda"
            y completar los campos que solicita el formulario. No olvide
            completar toda la información que se requiera. En lo posible tenga a
            mano un logo o imagen que identifique su tienda, los links a sus
            redes sociales, si posee y un número de Whatsapp. Una vez creada y
            habilitada la tienda, la información puede modificarse si lo
            necesita.
          </p>
        </details>

        <details close>
          <summary>¿Una vez que cree la tienda que debo hacer?</summary>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut nam
            illo, pariatur accusantium maxime modi magni sint quisquam
            voluptatibus, sed nihil deleniti consectetur excepturi perferendis
            in magnam placeat soluta hic?
          </p>
        </details>

        <details close>
          <summary>¿Es obligatorio conectar Mercado Pago?</summary>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam
            reiciendis repellat eligendi molestiae tenetur non quaerat rerum
            sint velit debitis odio molestias, voluptate dolor officiis eaque
            sequi blanditiis perspiciatis nobis.
          </p>
        </details>

        <details close>
          <summary>¿Cómo puedo editar la información de mi tienda?</summary>
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Harum a
            odio eveniet molestiae tenetur quia, temporibus, nisi ad error
            debitis necessitatibus. Vero magnam molestiae ipsam. Tempora
            voluptatibus accusantium fuga est?
          </p>
        </details>

        <details close>
          <summary>¿Cómo publico mis productos?</summary>
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit.
            Repellendus nam suscipit maiores sequi quas assumenda voluptates
            cumque, voluptatibus sunt illum dolorem quo sapiente fuga ducimus
            quia ullam veritatis debitis libero?
          </p>
        </details>

        <details close>
          <summary>¿Puedo publicar sin precio?</summary>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi
            placeat et quisquam. Eligendi ducimus inventore similique, sequi
            officia temporibus aut, nostrum maiores nobis impedit pariatur
            voluptatum, nam reiciendis? Perferendis, quis.
          </p>
        </details>

        <details close>
          <summary>
            ¿Puedo editar un producto para cambiar, por ejemplo, el precio?
          </summary>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet
            dicta error molestiae obcaecati, dolor odit earum. Laudantium iste
            iure facere commodi eos accusamus dolor. Sint dignissimos tempora
            ex! Dolores, quod.
          </p>
        </details>
      </div>
    </div>
    </>
  );
};

export default Faq;
