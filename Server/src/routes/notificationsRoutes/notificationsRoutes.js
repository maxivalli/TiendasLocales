const express = require("express");
const router = express.Router();

const notificationsControllers = require("../../controllers/notificationsControllers")

router.get("/getUserNotif/:userId", async (req, res) => {
    const { userId } = req.params
      try {
        const response = await notificationsControllers.getUserNotif(userId);
        return res.status(200).json(response);
      } catch (error) {
        return res.status(400).json(error.message);
      }
    });
  



module.exports = router;