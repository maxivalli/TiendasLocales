const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport(
  {
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "tiendaslocalescontacto@gmail.com",
      pass: "wxdj wbsw okip cugo", // pasarlo a .env
    },    tls: {
      rejectUnauthorized: false
    },
  },
  {
    from: '"Tiendas Locales" <registro@tiendaslocales.com>',
  }
);

module.exports = { transporter };
