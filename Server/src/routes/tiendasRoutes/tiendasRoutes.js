const express = require("express");
const router = express.Router();
const tiendasController = require("../../controllers/tiendasControllers");
const payController = require("../../controllers/payController");

let payUserData;

router.post("/createStore", async (req, res) => {
  const storeData = req.body;
  try {
    const response = await tiendasController.createStore(storeData);
    return res.status(201).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error.message);
  }
});

router.put("/updateStore/:storeId", async (req, res) => {
  const { storeId } = req.params;
  const storeData = req.body;
  try {
    const updatedStore = await tiendasController.updateStore(
      storeId,
      storeData
    );
    return res.status(200).json(updatedStore);
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
});

router.delete("/deleteStore/:storeId", async (req, res) => {
  const { storeId } = req.params;
  try {
    const deletedStore = await tiendasController.deleteStore(storeId);

    if (deletedStore) {
      return res.status(200).json("Store successfully deleted");
    } else {
      return res.status(404).json("Store not found");
    }
  } catch (error) {
    return res
      .status(500)
      .json({ error: "There was an error deleting the store" });
  }
});

router.post("/habStore", async (req, res) => {
  const { id } = req.body;

  try {
    const response = await tiendasController.habStore(id);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json(error.message);
  }
});

router.get("/getStore", async (req, res) => {
  const { id } = req.query;

  try {
    const response = await tiendasController.getStore(id);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json(error.message);
  }
});

router.get("/getAllStores", async (req, res) => {
  try {
    const response = await tiendasController.getAllStores();
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json(error.message);
  }
});

router.get("/getUserStore/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const response = await tiendasController.getUserStore(userId);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json(error.message);
  }
});

router.post("/create-order", async (req, res) => {
  const paymentData = req.body;

  try {
    const response = await payController.createOrder(paymentData);
    payUserData = response.allData;
    console.log("v", payUserData);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json(error.message);
  }
});

router.get("/success", async (req, res) => {
  try {
    const response = await payController.successfullPurchase(purchaseUserId);
    return res.send("Success");
  } catch (error) {
    return res.status(400).json(error.message);
  }
});

router.get("/failed", async (req, res) => {
  try {
    return res.send("Failure");
  } catch (error) {
    return res.status(400).json(error.message);
  }
});

router.get("/pending", async (req, res) => {
  try {
    return res.send("Pending");
  } catch (error) {
    return res.status(400).json(error.message);
  }
});

router.post("/webhook", async (req, res) => {
  const data = req.query;
  const allData = {
    data: data,
    payUserData: payUserData,
  };
  console.log("all", allData);
  try {
    const response = await payController.webhook(allData);
    return res.json(response);
  } catch (error) {
    return res.status(400).json(error.message);
  }
});

router.get("/allCompras", async (req, res) => {
  const id = req.body;

  try {
    const response = await payController.allCompras(id);
    return res.json(response);
  } catch (error) {
    return res.status(400).json(error.message);
  }
});

router.get("/pedidosCompras/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const response = await payController.pedidosCompras(id);
    return res.json(response);
  } catch (error) {
    return res.status(400).json(error.message);
  }
});

router.get("/comprasRecibidas/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const response = await payController.comprasRecibidas(id);
    return res.json(response);
  } catch (error) {
    return res.status(400).json(error.message);
  }
});

router.get("/comprasRealizadas/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const response = await payController.comprasRealizadas(id);
    return res.json(response);
  } catch (error) {
    return res.status(400).json(error.message);
  }
});

router.get("/redirectUrl", async (req, res) => {
  const { code, state } = req.query;

  try {
    const response = await payController.accT(code, state);
    if (response) {
      const htmlResponse = `
        <html>
          <head>
            <title>Token generado correctamente</title>
            <script>
              alert('Token generado correctamente! Puedes cerrar esta pestaña');
              window.open('', '_self', '');
              window.close();
            </script>
          </head>
        </html>
      `;
      return res.status(200).send(htmlResponse);
    }
  } catch (error) {
    return res.status(400).json(error.message);
  }
});

router.get("/categories/:category", async (req, res) => {
  const { category } = req.params;

  try {
    const response = await tiendasController.getStoresByCategory(category);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
});

router.get("/getStoreByName/name", async (req, res) => {
  const { name } = req.query;
  try {
    const stores = await tiendasController.getStoreByName(name);
    return res.status(200).json(stores);
  } catch (error) {
    res
      .status(500)
      .json({
        error: "There was an error obtaining the store information",
        details: error.message,
      });
  }
});

router.put("/enviado/:itemId", async (req, res) => {
  const { itemId } = req.params;
  try {
    const response = await tiendasController.enviado(itemId);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json(error.message);
  }
});

router.put("/isStoreOpen/:valor/:storeId", async (req, res) => {
  const { valor } = req.params;
  const { storeId } = req.params;
  try {
    const response = await tiendasController.isStoreOpen(valor, storeId);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json(error.message);
  }
});

router.put("/getOpenStores", async (req, res) => {
  try {
    const response = await tiendasController.getOpenStores();
    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json(error.message);
  }
});
module.exports = router;
