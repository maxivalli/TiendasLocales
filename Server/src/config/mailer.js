const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport(
  {
    host: "smtp.zoho.com",
    port: 465,
    secure: true,
    auth: {
      user: "contacto@tiendaslocales.com.ar",
      pass: "HUPsGZyKfyVc", // pasarlo a .env
    },    tls: {
      rejectUnauthorized: false
    },
  },
);

module.exports = { transporter };
