const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport(
  {
    host: "smtp.zoho.com",
    port: 465,
    secure: true,
    auth: {
      user: "contacto@mail.tiendaslocales.com.ar",
      pass: "YAjNMXKCphyS", // pasarlo a .env
    },    tls: {
      rejectUnauthorized: false
    },
  },
);

module.exports = { transporter };
