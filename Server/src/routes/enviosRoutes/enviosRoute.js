const express = require("express");
const router = express.Router();
const enviosController = require("../../controllers/enviosController");


router.post('/ubiForm', async (req, res) => {
   const ubicationData = req.body;
    try {
      const response = await enviosController.crearDireccionUsuario(ubicationData);
      return res.status(201).json(response);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error al subir la direccion.' });
    }
  });
  
module.exports = router;


