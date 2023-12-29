const express = require("express");
const router = express.Router();
const codesController = require("../../controllers/codesControllers");

router.get("/codigoForgot/:codigo", async (req, res) => {
    const { codigo } = req.params;
    const code = parseInt(codigo)
  try {
    const response = await codesController.comprobarCodigo(code);
    return res.status(201).json(response);
  } catch (error) {
    return res.status(500).json({ error: "Codigo incorrecto" });
  }
});

module.exports = router;

