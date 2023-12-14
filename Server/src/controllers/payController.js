const { NUMBER } = require("sequelize");
const { User, Compra, Post } = require("../DB_config");
require("dotenv").config();
const { ACCESS_TOKEN } = process.env;
const mercadopago = require("mercadopago");

mercadopago.configure({
    access_token: ACCESS_TOKEN
}) 

exports.createOrder = async (paymentData) => {
    try{
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
            notification_url: "https://6ccd-201-190-175-186.ngrok.io/tiendas/webhook"
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