// routes/favorites.js
const express = require("express");
const router = express.Router();
const favoritesController = require("../../controllers/favoritesController"); // Asegúrate de importar el modelo de Chat



// Añadir a favoritos
router.post("/addFavorite/:userId/:favoriteUserId", async (req, res) => {
  const { userId, favoriteUserId } = req.params;

  try {
    await favoritesController.createFavorite({ userId, favoriteUserId });
    res.status(200).send("Usuario agregado a favoritos correctamente");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al agregar usuario a favoritos");
  }
});

router.delete("/removeFavorite/:userId/:favoriteUserId", async (req, res) => {
    const { userId, favoriteUserId } = req.params;
  
    try {
      await favoritesController.removeFavorite({ userId, favoriteUserId });
      res.status(200).send("Usuario removido de favoritos correctamente");
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al remover usuario de favoritos");
    }
  });

// Obtener favoritos de un usuario
router.get("/getFavorites/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const favorites = await favoritesController.getFavorites(userId);
    res.status(200).json(favorites);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al obtener favoritos del usuario");
  }
});

module.exports = router;
