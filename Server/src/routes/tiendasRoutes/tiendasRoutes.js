const express = require("express");
const router = express.Router();
const tiendasController = require("../../controllers/tiendasControllers");


router.post('/createStore', async (req, res) => {
    const storeData = req.body
    try {
      const response = await tiendasController.createStore(storeData);
      return res.status(201).json(response);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error al crear la tienda.' });
    }
  });

module.exports = router;


