const { User, Compra, Post, Tienda } = require("../DB_config");
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
                failure: "https://www.tiendaslocales.com.ar/#/",
                pending: "https://www.tiendaslocales.com.ar/#/",
                success: "https://www.tiendaslocales.com.ar/#/"
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
              productImage: post.image,
              enviado: false,
            });
            await newCompra.save();
          }
         
          const comprador = await User.findOne({
            where: {
              id: allData.payUserData.userId,
            },
          });
          const post = await Post.findOne({
            where: {
                id: allData.payUserData.postId,
            },
          });
  
          const vendedor = await User.findOne({
            where: {
              id: post.userId
            }
          })
  
          const store = await Tienda.findOne({
            where: {
              userId: vendedor.id
            }
          })
          
            
            const data = {allData: allData, comprador: comprador, vendedor: vendedor, post: post, store: store}
            console.log("ESTO SE ENVIA EN LOS SOCKET", data);
            io.to(vendedor?.socketId).emit('ventaRealizada', data)
            io.to(comprador?.socketId).emit('compraRealizada', data)
            await transporter.sendMail(compraMail(comprador));
          
        
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


exports.comprasRecibidas = async (id) => {
  try{
      const comprasRecibidas = await Compra.findAll({
          where: {
              storeId: id
          },
        });

      return comprasRecibidas
  } catch (error){
     throw new Error(error)
  }
}

exports.comprasRealizadas = async (id) => {
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

exports.allCompras = async () => {
  try{
      const allCompras = await Compra.findAll();
      return allCompras
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