const { Notifications } = require("../DB_config");

exports.getUserNotif = async (userId) => {
    try {
      const notifications = await Notifications.findAll({
        where: {
          userId: userId,
        },
      });
      return notifications;
    } catch (error) {
      console.error("Error al obtener notificaciones del usuario:", error);
      return []
    }
  };