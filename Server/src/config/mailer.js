const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport(
  {
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "tiendaslocales@gmail.com",
      pass: "tucr tvww qwpz rydo",
    },    tls: {
      rejectUnauthorized: false
    },
  },
  {
    from: '"Tiendas Locales" <registro@tiendaslocales.com>',
  }
);

module.exports = { transporter };
