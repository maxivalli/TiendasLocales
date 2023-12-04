const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport(
  {
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "santinomantineo@gmail.com",
      pass: "xhte unry ylzu pmip", // pasarlo a .env
    },    tls: {
      rejectUnauthorized: false
    },
  },
  {
    from: '"Tiendas Locales" <registro@santinomantineo.com>',
  }
);

module.exports = { transporter };
