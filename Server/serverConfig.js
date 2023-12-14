const express = require("express");
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const { User, Notifications } = require("./src/DB_config");

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
      await Notifications.create({
        content: addText,
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
    io.to(userSocket).emit("addFavorite", storeId);
    console.log(`socket addFavorite emitido al front a ${userSocket}`);
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
    "https://tiendaslocales.com.ar",
    "https://lo-canjeamos-production.up.railway.app",
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
