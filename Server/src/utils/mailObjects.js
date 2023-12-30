const fs = require('fs');
const { Code } = require("../DB_config");

const registerTemplate = fs.readFileSync(__dirname + '/register.html', 'utf8');
const forgotTemplate = fs.readFileSync(__dirname + '/forgot.html', 'utf8');
const postTemplate = fs.readFileSync(__dirname + '/newPost.html', 'utf8');
const habStoreTemplate = fs.readFileSync(__dirname + '/habStore.html', 'utf8'); 
const compraTemplate = fs.readFileSync(__dirname + '/compra.html', 'utf8'); 

const registerMail = (user) => {
  return {
    to: user.email,
    from: '"Tiendas Locales" <contacto@tiendaslocales.com.ar>',
    subject: "Registro completado",
    html: registerTemplate,
  };
};

const habStoreMail = (user) => {
  return {
    to: user.email,
    from: '"Tiendas Locales" <contacto@tiendaslocales.com.ar>',
    subject: "Tienda habilitada",
    html: habStoreTemplate,
  };
};

const compraMail = (user) => {
  return {
    to: user.email,
    from: '"Tiendas Locales" <contacto@tiendaslocales.com.ar>',
    subject: "Compra Realizada",
    html: compraTemplate,
  };
};

const postCreated = (email, postData) => {
  const { title, description, price, stock, image } = postData;
  const urlPersonalizada = `http://tiendaslocales.com.ar/#/micuenta`; 

  const notificationEmail = postTemplate
    .replace('{{title}}', title)
    .replace('{{description}}', description)
    .replace('{{price}}', price)
    .replace('{{stock}}', stock)
    .replace('{{image}}', image)
    .replace('{{link}}', urlPersonalizada);


  return {
    to: email,
    from: '"Tiendas Locales" <contacto@tiendaslocales.com.ar>',
    subject: "Publicación Creada",
    html: notificationEmail,
  }
}






const passwordForgot = (email, id) => {
  const urlPersonalizada = `https://tiendasLocales.com.ar/#/resetpassword/${id}`;
  //const urlPersonalizada = `http://localhost:5173/#/resetpassword/${id}`;

  function generarCodigoAleatorio() {
    const longitudCodigo = 6;
    const minimo = Math.pow(10, longitudCodigo - 1);
    const maximo = Math.pow(10, longitudCodigo) - 1;
  
    return Math.floor(Math.random() * (maximo - minimo + 1)) + minimo;
  }
  
  const codigo = generarCodigoAleatorio();
  Code.create({
    codigoForgot: parseInt(codigo),
  });

  
  const forgotTemplateWithLink = forgotTemplate
  .replace("{{reset_password_link}}", urlPersonalizada)
  .replace("{{codigo}}", codigo)
  
  return {
    to: email,
    from: '"Tiendas Locales" <contacto@tiendaslocales.com.ar>',
    subject: "Recuperacion de contraseña",
    html: forgotTemplateWithLink,
  }
}

module.exports = { registerMail, postCreated, passwordForgot, habStoreMail, compraMail };
