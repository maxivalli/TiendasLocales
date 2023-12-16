const { User, Compra, Post } = require("../DB_config");
require("dotenv").config();
const { ACCESS_TOKEN, CLIENT_ID, CLIENT_SECRET } = process.env;
const mercadopago = require("mercadopago");
const axios = require("axios");


exports.createOrder = async (paymentData) => {
    try{
        mercadopago.configure({
            access_token: paymentData.accT
        });
        console.log(paymentData)
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
                failure: "http://localhost:5173/#/account",
                pending: "http://localhost:5173/#/account",
                success: "http://localhost:5173/#/account"
            },
            notification_url: "https://df5f-201-190-251-186.ngrok.io/tiendas/webhook"
        }

        const response = await mercadopago.preferences.create(preference);

        let allData = preference.items[0]
        const respuesta = {response, allData};
    
        
        return respuesta
    } catch (error){
        res.status(400).json({error: error.message});
    }
} 

exports.webhook = async (allData) => {
    if (allData.data.type === "payment") {

        const post = await Post.findOne({
            where: {
                id: allData.payUserData.postId,
            },
          });

        post.stock = post.stock - allData.payUserData.quantity;
        await post.save();

        const newCompra = await Compra.create({
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
    } else {
        throw new Error("Invalid webhook event type");
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
        const searchId = id.id

        const misPedidos = await Compra.findAll({
            where: {
                storeId: searchId
            },
          });

        return misPedidos
    } catch (error){
       throw new Error(error)
    }
}
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
          redirect_uri: 'https://df5f-201-190-251-186.ngrok.io/tiendas/redirectUrl',
          test_token: true,
        }),
      });
  
      const data = await response.json();
      const accessToken = data.access_token;
  
      // Ahora puedes hacer algo con el accessToken, por ejemplo, guardarlo en la base de datos para el usuario.
      const user = await User.findOne({
        where: {
          id: state,
        },
      });
  
      user.accT = accessToken;
      await user.save();
  
      return true
    } catch (error) {
      throw new Error(error);
    }
  };