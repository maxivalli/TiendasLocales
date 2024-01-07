const express = require("express");
const { createServer } = require("node:http");
const { Server } = require("socket.io");

const { User, Notifications, Tienda, Compra } = require("./src/DB_config");

const router = require("./src/routes/routes");
const matchsSockets = require("./src/controllers/payController");

const admin = require("firebase-admin");
const serviceAccount = require("./src/keys/tiendaslocales-7bbf8-firebase-adminsdk-m33z6-85cb8f0439.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

matchsSockets.setSocketIO(io);

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

  socket.on("mensajeGeneral", async (data) => {
    const { titulo, texto } = data;

    const users = await User.findAll();

    users.forEach(async (user) => {
      if (user.FCMtoken) {
        const message = {
          data: {
            title: titulo,
            text: texto,
          },
          token: user.FCMtoken,
        };
    
        admin
          .messaging()
          .send(message)
          .then((response) => {
            console.log(`Successfully sent message to ${user.username}:`, response);
          })
          .catch((error) => {
            console.log(`Error sending message to ${user.username}:`, error);
          });
      }
      try {
        const existingNotification = await Notifications.findOne({
          where: {
            content: texto,
            userId: user.id,
          },
        });
  
        if (!existingNotification) {
          await Notifications.create({
            content: `Tiendas Locales: ${titulo} - ${texto}`,
            userId: user.id,
            image: "https://firebasestorage.googleapis.com/v0/b/tiendaslocales-7bbf8.appspot.com/o/logo.png?alt=media&token=bca80e33-79d3-4b7e-8e50-e7cb026a2a58",
            type: "aviso"
          });
  
          console.log("Notificación almacenada en la base de datos");
        } else {
          existingNotification.read = false;
          await existingNotification.save();
  
          console.log(
            "Notificación ya existe en la base de datos, propiedad 'read' actualizada a true"
          );
        }
      } catch (error) {
        console.error(
          "Error al almacenar/comprobar notificación en la base de datos:",
          error
        );
      }
      const userSocket = user.socketId;
      io.to(userSocket).emit("mensajeGeneral");
    });
  });

  socket.on("productoEnviado", async (data) => {
    const { itemId, comprador, userStore } = data;

    const item = await Compra.findByPk(itemId);
    const text = `Su compra de ${item.quantity} ${item.title} ya ha sido despachada por ${userStore.nombre}`

    if (comprador.FCMtoken) {
      const message = {
        data: {
          title: `${comprador.username}`,
          text: text,
        },
        token: comprador.FCMtoken,
      };

      admin
        .messaging()
        .send(message)
        .then((response) => {
          console.log("Successfully sent message:", response);
        })
        .catch((error) => {
          console.log("Error sending message:", error);
        });
    }

    try {
      const existingNotification = await Notifications.findOne({
        where: {
          content: text,
          userId: comprador.id,
        },
      });

      if (!existingNotification) {
        await Notifications.create({
          content: text,
          userId: comprador.id,
          image: item.productImage,
          type: "envio"
        });

        console.log("Notificación almacenada en la base de datos");
      } else {
        existingNotification.read = false;
        await existingNotification.save();

        console.log(
          "Notificación ya existe en la base de datos, propiedad 'read' actualizada a true"
        );
      }
    } catch (error) {
      console.error(
        "Error al almacenar/comprobar notificación en la base de datos:",
        error
      );
    }

    const userSocket = comprador.socketId;
    io.to(userSocket).emit("productoEnviado");
    console.log(`socket productoEnviado emitido al front a ${comprador.username}`);
  });

  socket.on("waitingStore", async (data) => {
    const { storeData, userData } = data;
    const { nombre, image, userId } = storeData;

    if (userData?.FCMtoken) {
      const message = {
        data: {
          title: `${userData?.username}`,
          text: `Su tienda "${nombre}" se encuentra en espera de aprobación`,
        },
        token: userData?.FCMtoken,
      };

      admin
        .messaging()
        .send(message)
        .then((response) => {
          console.log("Successfully sent message:", response);
        })
        .catch((error) => {
          console.log("Error sending message:", error);
        });
    }

    const waiterText = `Su tienda "${nombre}" se encuentra en espera de aprobación`;
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
    const userdata = { nombre: nombre, image: image };
    io.to(userSocket).emit("waitingStore", userdata);
  });

  socket.on("approvedStore", async (data) => {
    const { storeData, userData } = data;
    const { nombre, image, userId } = storeData;

    const usertoken = await User.findByPk(userId);

    if (usertoken?.FCMtoken) {
      const message = {
        data: {
          title: `${usertoken?.username}`,
          text: `Su tienda "${nombre}" fue aprobada!`,
        },
        token: usertoken?.FCMtoken,
      };

      admin
        .messaging()
        .send(message)
        .then((response) => {
          console.log("Successfully sent message:", response);
        })
        .catch((error) => {
          console.log("Error sending message:", error);
        });
    }

    const approvedText = `Su tienda "${nombre}" fue aprobada!`;
    try {
      await Notifications.create({
        content: approvedText,
        userId: userId,
        image: image,
        type: "store"
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
    const userdata = { nombre: nombre, image: image };
    io.to(userSocket).emit("approvedStore", userdata);
  });

  socket.on("newMessage", async (messageData) => {
    const { people, lastMessage, sender, senderId, url } = messageData;
    const addressee = people.find(
      (people) => people.person.username !== sender
    );

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
          },
        });

        // Si es una tienda guarda la noti en la DB y manda el evento
        const userId = store.userId;
        const image = store.image;
        const storeId = store.id;
        let messageNotificationText;
        if (lastMessage.length < 10) {
          messageNotificationText = `Tu tienda ha recibido un nuevo mensaje de ${sender}: "${lastMessage}"`;
        } else {
          messageNotificationText = `Tu tienda ha recibido un nuevo mensaje de ${sender}`;
        }

        await Notifications.create({
          content: messageNotificationText,
          userId: userId,
          image: image,
          type: "storeMessage"
        });
        const user = await User.findByPk(userId);
        const userSocket = user.socketId;

        if (user.FCMtoken) {
          const message = {
            data: {
              title: store.nombre,
              text: messageNotificationText,
              path: url
            },
            token: user.FCMtoken,
          };

          admin
            .messaging()
            .send(message)
            .then((response) => {
              console.log("Successfully sent message:", response);
            })
            .catch((error) => {
              console.log("Error sending message:", error);
            });
        }

        const data = {
          storeId: storeId,
          image: image,
          lastMessage: lastMessage,
          sender: sender,
        };
        io.to(userSocket).emit("newMessage", data);
      }
      // si es un usuario guarda la noti en la DB y manda el evento
      const userId = user?.id;
      const image = user?.image;
      if (user) {
        let messageNotificationText;
        if (lastMessage.length < 10) {
          messageNotificationText = `Has recibido un nuevo mensaje de ${sender}: "${lastMessage}"`;
        } else {
          messageNotificationText = `Has recibido un nuevo mensaje de ${sender}`;
        }
        await Notifications.create({
          content: messageNotificationText,
          userId: userId,
          image: image,
          type: "userMessage"
        });

        if (user.FCMtoken) {
          const message = {
            data: {
              title: user.username,
              text: messageNotificationText,
            },
            token: user.FCMtoken,
          };

          admin
            .messaging()
            .send(message)
            .then((response) => {
              console.log("Successfully sent message:", response);
            })
            .catch((error) => {
              console.log("Error sending message:", error);
            });
        }

        const userSocket = user?.socketId;
        const data = {
          nombre: user?.username,
          image: image,
          lastMessage: lastMessage,
          sender: sender,
        };
        io.to(userSocket).emit("newMessage", data);
      }
    } catch (error) {
      throw error;
    }
  });

  socket.on("compraRealizadaToDB", async (data) => {
    console.log("COMPRAREALIZADA", data);
    const {comprador, store, cantidad, title, vendedor, post, allData, userData} = data;

    if (comprador?.FCMtoken) {
      const message = {
        data: {
          title: `${comprador?.username}`,
          text: `¡Tu compra de ${cantidad} ${title} ha sido notificada a ${store?.nombre}!`,
        },
        token: comprador?.FCMtoken,
      };

      admin
        .messaging()
        .send(message)
        .then((response) => {
          console.log("Successfully sent message:", response);
        })
        .catch((error) => {
          console.log("Error sending message:", error);
        });
    }

    const compraText = `¡Tu compra de ${cantidad} ${title} ha sido notificada a ${store?.nombre}!`
    try {
      await Notifications.create({
        content: compraText,
        userId: comprador?.id,
        image: post?.image,
        type: "compra"
      });
      console.log("Notificación almacenada en la base de datos");
    } catch (error) {
      console.error(
        "Error al almacenar notificación en la base de datos:",
        error
      );
    }
  });

  socket.on("ventaRealizadaToDB", async (data) => {
    console.log("VENTAREALIZADA", data);
    const {comprador, cantidad, store, vendedor, post, allData, title, compradorName, image} = data;
    

    if (vendedor?.FCMtoken) {
      const message = {
        data: {
          title: `${vendedor?.username}`,
          text: `¡${compradorName} te ha comprado ${cantidad} ${title}!`,
        },
        token: vendedor?.FCMtoken,
      };

      admin
        .messaging()
        .send(message)
        .then((response) => {
          console.log("Successfully sent message:", response);
        })
        .catch((error) => {
          console.log("Error sending message:", error);
        });
    }

    const compraText = `¡${compradorName} te ha comprado ${cantidad} ${title}!`
    try {
      await Notifications.create({
        content: compraText,
        userId: vendedor?.id,
        image: image,
        type: "venta"
      });
      console.log("Notificación almacenada en la base de datos");
    } catch (error) {
      console.error(
        "Error al almacenar notificación en la base de datos:",
        error
      );
    }
  });

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

app.use(function (req, res, next) {
  //     CAMBIAR POR LAS URL DE TIENDAS LOCALES
  const allowedOrigins = [
    "http://localhost:5173",
    "https://www.tiendaslocales.com.ar",
  ]; // Lista de URLs permitidas
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
