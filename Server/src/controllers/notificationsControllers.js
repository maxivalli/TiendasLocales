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

  exports.deleteUserNotif = async (userId) => {
    try {
      // Buscar y eliminar todas las notificaciones del usuario
      const deletedRows = await Notifications.destroy({
        where: {
          userId: userId,
        },
      });
      
      return deletedRows;
    } catch (error) {
      console.error("Error al eliminar notificaciones del usuario:", error);
      return 0;
    }
  };