const { Router } = require("express");
const usersRoutes = require("./userRoutes/userRoutes")
const postsRoutes = require("./postRoutes/postRoutes")
const messageRoutes = require("./messageRoutes/messageRoutes")
const chatsRoutes = require('./chatsRoutes/chatsRoutes')
const reviewsRoutes = require("./reviewsRoutes/reviewsRoutes")
const enviosRoutes = require("./enviosRoutes/enviosRoute")
const favoritesRoutes = require(".//favoritesRoutes/favoritesRoutes")
const tiendasRoutes = require("./tiendasRoutes/tiendasRoutes")
const notificationsRoutes = require("./notificationsRoutes/notificationsRoutes")
const codesRoutes = require("./codesRoutes/codesRoutes")

const router = Router();


router.use('/users', usersRoutes)
router.use("/favorites", favoritesRoutes);
router.use('/posts', postsRoutes)
router.use('/messages', messageRoutes)
router.use('/chats', chatsRoutes)
router.use('/envios', enviosRoutes)
router.use('/reviews', reviewsRoutes)
router.use('/tiendas', tiendasRoutes)
router.use('/notif', notificationsRoutes)
router.use('/codes', codesRoutes)

module.exports = router;