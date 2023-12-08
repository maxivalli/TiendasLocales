// routes/favorites.js
const express = require("express");
const router = express.Router();
const favoritesController = require("../../controllers/favoritesController"); // Asegúrate de importar el modelo de Chat



// Añadir a favoritos
router.post("/addFavorite/:userId/:storeId", async (req, res) => {
  const { userId, storeId } = req.params;
  try {
    await favoritesController.createFavorite( userId, storeId );
    res.status(200).send("Tienda agregada a favoritos correctamente");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al agregar tienda a favoritos");
  }
});

router.delete("/removeFavorite/:userId/:storeId", async (req, res) => {
    const { userId, storeId } = req.params;
  
    try {
      await favoritesController.removeFavorite( userId, storeId );
      res.status(200).send("Tienda removida de favoritos correctamente");
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al remover tienda de favoritos");
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
