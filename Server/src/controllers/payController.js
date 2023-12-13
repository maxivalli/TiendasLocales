const { User } = require("../DB_config");
require("dotenv").config();
const { ACCESS_TOKEN } = process.env;
const mercadopago = require("mercadopago");

mercadopago.configure({
    access_token: ACCESS_TOKEN
}) 

exports.createOrder = async (paymentData) => {
    let postId = paymentData.postId
    let userId = paymentData.userId
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
            notification_url: "https://1167-201-190-175-186.ngrok.io/tiendas/webhook"
        }

        const response = await mercadopago.preferences.create(preference);

        const respuesta = {response, postId, userId};
    
        
        return respuesta
    } catch (error){
        res.status(400).json({error: error.message});
    }
} 

exports.webhook = async ({data, payUserData}) => {
    if (data.type === "payment") {
        console.log("AAA", payUserData)
    } else {
        throw new Error("Invalid webhook event type");
    }
}