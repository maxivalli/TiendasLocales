const { Router } = require("express");
const usersRoutes = require("./userRoutes/userRoutes")
const postsRoutes = require("./postRoutes/postRoutes")
const plansRoutes = require("./plansRoutes/plansRoutes")
const messageRoutes = require("./messageRoutes/messageRoutes")
const matchRoutes = require("./matchRoutes/matchRoutes")
const likesRoutes = require("./likesRoutes/likeRoutes")
const chatsRoutes = require('./chatsRoutes/chatsRoutes')
const reviewsRoutes = require("./reviewsRoutes/reviewsRoutes")
const enviosRoutes = require("./enviosRoutes/enviosRoute")
const favoritesRoutes = require(".//favoritesRoutes/favoritesRoutes")
const tiendasRoutes = require("./tiendasRoutes/tiendasRoutes")

const router = Router();


router.use('/users', usersRoutes)
router.use("/favorites", favoritesRoutes);
router.use('/posts', postsRoutes)
router.use('/likes', likesRoutes)
router.use('/matches', matchRoutes)
router.use('/messages', messageRoutes)
router.use('/plans', plansRoutes)
router.use('/chats', chatsRoutes)
router.use('/envios', enviosRoutes)
router.use('/reviews', reviewsRoutes)
router.use('/tiendas', tiendasRoutes)

module.exports = router;