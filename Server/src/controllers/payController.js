const { User, Compra, Post } = require("../DB_config");
require("dotenv").config();
const { ACCESS_TOKEN, CLIENT_ID, CLIENT_SECRET, CRYPTO_KEY } = process.env;
const mercadopago = require("mercadopago");
const axios = require("axios");
const CryptoJS = require('crypto-js');
const { compraMail } = require("../utils/mailObjects");
const { transporter } = require("../config/mailer");

let io;

exports.setSocketIO = (socketIOInstance) => {
  io = socketIOInstance;
};

exports.createOrder = async (paymentData) => {
    try{
      const decryptedData = CryptoJS.AES.decrypt(paymentData.accT, secretKey).toString(CryptoJS.enc.Utf8);

      mercadopago.configure({
        access_token: decryptedData
      });

        let preference = {
            items: [{
                postId: paymentData.postId,
                userId: paymentData.userId,
                title: paymentData.title,
                quantity: paymentData.quantity,
                unit_price: paymentData.price,
                currency_id: "ARG",
                description: paymentData.description,
            }],
            back_urls: {  // Corrected property name to 'back_urls'
                failure: "https://tiendaslocales.com.ar/#/account",
                pending: "https://tiendaslocales.com.ar/#/account",
                success: "https://tiendaslocales.com.ar/#/account"
            },
            notification_url: "https://tiendaslocales-production.up.railway.app/tiendas/webhook"
        }

        const response = await mercadopago.preferences.create(preference);

        let allData = preference.items[0]
        allData.userDireccion = paymentData.userDireccion;
        allData.delivery = paymentData.delivery;

        const respuesta = {response, allData};
        console.log("RRRRRr", respuesta);
        
        return respuesta
    } catch (error){
        res.status(400).json({error: error.message});
    }
} 
exports.webhook = async (allData) => {
  console.log("a", allData);
      try {
        if (allData.data.type === "payment") {

          if(allData.payUserData.postId){
            const post = await Post.findOne({
              where: {
                  id: allData.payUserData.postId,
              },
            });
  
          post.stock = post.stock - allData.payUserData.quantity;
          await post.save();
            console.log("1")
            const newCompra = await Compra.create({
              userDireccion: allData.payUserData.userDireccion,
              delivery: allData.payUserData.delivery,
              userId: allData.payUserData.userId,
              postId: allData.payUserData.postId,
              storeId: post.storeId,
              title: allData.payUserData.title,
              quantity: allData.payUserData.quantity,
              unit_price: allData.payUserData.unit_price,
              currency_id: allData.payUserData.currency_id,
              description: allData.payUserData.description,
              productImage: post.image
            });
            await newCompra.save();
            console.log("2", newCompra)
          }
          const comprador = await User.findOne({
            where: {
              id: allData.payUserData.userId,
            },
          });

          const post = await Post.findOne({
            where: {
              // Estoy buscando el post adecuado?
                id: allData.payUserData.postId,
            },
          });

          const vendedor = await User.findOne({
            where: {
              // el post que uso de referencia es el producto comprado?
              id: post.userId
            }
          })
          
          if(vendedor){
            io.to(vendedor.socketId).emit('ventaRealizada', allData)
          }
          
          if(comprador){
            io.to(comprador.socketId).emit('compraRealizada', allData)
            await transporter.sendMail(compraMail(comprador));
          }
        
          return true
        }
      } catch (error) {
          return {
              error: error.message
          };
      }
  }

exports.allCompras = async (id) => {

    try{
        const searchId = id.id

        const misCompras = await Compra.findAll({
            where: {
                userId: searchId
            },
          });

        return misCompras
    } catch (error){
       throw new Error(error)
    }
}

exports.pedidosCompras = async (id) => {

    try{

        const misPedidos = await Compra.findAll({
            where: {
                storeId: id
            },
          });

        return misPedidos
    } catch (error){
       throw new Error(error)
    }
}

exports.comprasRecibidas = async (id) => {

  try{

      const misPedidos = await Compra.findAll({
          where: {
              userId: id
          },
        });

      return misPedidos
  } catch (error){
     throw new Error(error)
  }
}

const secretKey = CRYPTO_KEY;

exports.accT = async (code, state) => {

  try {
    const response = await fetch('https://api.mercadopago.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: '6356168129471214',
        client_secret: 'dbj3rL8bNBQ6UOzxaI4nOEjTcC22yAMa',
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: 'https://tiendaslocales-production.up.railway.app/tiendas/redirectUrl',
      }),
    });

    const data = await response.json();
    const accessToken = data.access_token;

    const encryptedData = CryptoJS.AES.encrypt(accessToken, secretKey).toString();

    const user = await User.findOne({
      where: {
        id: state,
      },
    });

    user.accT = encryptedData;
    await user.save();

    return true
  } catch (error) {
    throw new Error(error);
  }
};