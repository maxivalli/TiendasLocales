const express = require("express");
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const { User, Notifications, Tienda } = require("./src/DB_config");

const router = require("./src/routes/routes");
const { Message } = require("./src/DB_config");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("Un cliente se ha conectado");

  socket.on("assignSocketId", async (userId) => {
    try {
      const user = await User.findByPk(userId);
      if (user) {
        user.socketId = socket.id;
        user.save();
        console.log(`Socket.id ${socket.id} asignado a User ${userId}`);
      }
    } catch (error) {
      console.error("Error al asignar Socket.id al usuario:", error);
    }
  });

  socket.on("addFavorite", async (addData) => {
    const { userId, storeId, addText, image } = addData;
  
    try {
      const existingNotification = await Notifications.findOne({
        where: {
          content: addText,
          userId: userId,
        },
      });
  
      if (!existingNotification) {
        await Notifications.create({
          content: addText,
          userId: userId,
          image: image,
        });
  
        console.log("Notificación almacenada en la base de datos");
      } else {
        existingNotification.read = false;
        await existingNotification.save();
        
        console.log("Notificación ya existe en la base de datos, propiedad 'read' actualizada a true");
      }
    } catch (error) {
      console.error("Error al almacenar/comprobar notificación en la base de datos:", error);
    }
  
    const user = await User.findByPk(userId);
    const userSocket = user.socketId;
    io.to(userSocket).emit("addFavorite", storeId);
    console.log(`socket addFavorite emitido al front a ${userSocket}`);
  });

  socket.on("addFavoritePost", async (addData) => {
    const { userId, postId, addText, image } = addData;
  
    try {
      const existingNotification = await Notifications.findOne({
        where: {
          content: addText,
          userId: userId,
        },
      });
  
      if (!existingNotification) {
        await Notifications.create({
          content: addText,
          userId: userId,
          image: image,
        });
  
        console.log("Notificación almacenada en la base de datos");
      } else {
        existingNotification.read = false;
        await existingNotification.save();
        
        console.log("Notificación ya existe en la base de datos, propiedad 'read' actualizada a true");
      }
    } catch (error) {
      console.error("Error al almacenar/comprobar notificación en la base de datos:", error);
    }
  
    const user = await User.findByPk(userId);
    const userSocket = user.socketId;
    io.to(userSocket).emit("addFavoritePost", postId);
  });
  

  socket.on("waitingStore", async (storeData) => {
    const { nombre, image, userId } = storeData
    const waiterText = `Su tienda "${nombre}" se encuentra en espera de aprobación`
    try {
      await Notifications.create({
        content: waiterText,
        userId: userId,
        image: image,
      });
      console.log("Notificación almacenada en la base de datos");
    } catch (error) {
      console.error(
        "Error al almacenar notificación en la base de datos:",
        error
      );
    }
    const user = await User.findByPk(userId);
    const userSocket = user.socketId;
    const data = { nombre: nombre, image: image }
    io.to(userSocket).emit("waitingStore", data);
  });

  socket.on("approvedStore", async (storeData) => {
    const { nombre, image, userId } = storeData
    const approvedText = `Su tienda "${nombre}" fue aprobada!`
    try {
      await Notifications.create({
        content: approvedText,
        userId: userId,
        image: image,
      });
      console.log("Notificación almacenada en la base de datos");
    } catch (error) {
      console.error(
        "Error al almacenar notificación en la base de datos:",
        error
      );
    }
    const user = await User.findByPk(userId);
    const userSocket = user.socketId;
    const data = { nombre: nombre, image: image }
    io.to(userSocket).emit("approvedStore", data);
  });


  socket.on("newMessage", async (messageData) => {
    const { people, lastMessage, sender, senderId } = messageData
    const addressee = people.find((people)=> people.person.username !== sender)
     try {
      // busca el destinatario entre los usuarios
      const user = await User.findOne({
        where: {
          username: addressee.person.username,
        },
      });
      // Si el destinatario no es un usuario, lo busca entre las tiendas
      if (!user) {
        const store = await Tienda.findOne({
          where: {
            nombre: addressee.person.username,
          }
        })
        // Si es una tienda guarda la noti en la DB y manda el evento
        const userId = store.userId
        const image = store.image
        const storeId = store.id
        let messageNotificationText
        if (lastMessage.length < 10){
          messageNotificationText = `Tu tienda ha recibido un nuevo mensaje de ${sender}: "${lastMessage}"`
        } else {
         messageNotificationText = `Tu tienda ha recibido un nuevo mensaje de ${sender}`
        }
        await Notifications.create({
          content: messageNotificationText,
          userId: userId,
          image: image,
        });
        const user = await User.findByPk(userId);
        const userSocket = user.socketId;
        const data = { storeId: storeId, image: image, lastMessage: lastMessage, sender: sender }
        io.to(userSocket).emit("newMessage", data);
      } 
        // si es un usuario guarda la noti en la DB y manda el evento
        const userId = user?.id
        const image = user?.image
        if (user) {
        let messageNotificationText
        if (lastMessage.length < 10){
          messageNotificationText = `Has recibido un nuevo mensaje de ${sender}: "${lastMessage}"`
         } else {
          messageNotificationText = `Has recibido un nuevo mensaje de ${sender}`
         }
        await Notifications.create({
          content: messageNotificationText,
          userId: userId,
          image: image,
        });
        const userSocket = user?.socketId;
        const data = { nombre: user?.username, image: image, lastMessage: lastMessage, sender: sender }
        io.to(userSocket).emit("newMessage", data);
      }
      
    }catch (error) {
      throw error
    }
  })


  socket.on("disconnect", () => {
    console.log("Un cliente se ha desconectado");
  });
});

const morgan = require("morgan");
const cors = require("cors");
const mercadopago = require("mercadopago");

app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

app.use(function (req, res, next) {                 //     CAMBIAR POR LAS URL DE TIENDAS LOCALES
  const allowedOrigins = ['http://localhost:5173', 'https://tiendaslocales.com.ar']; // Lista de URLs permitidas
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Credentials", "true");
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
  }
  next();
});

app.use(router);

module.exports = httpServer;
