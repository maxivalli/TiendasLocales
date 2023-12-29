const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Code = sequelize.define("Code", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    codigoForgot: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  });
  Code.addHook('afterCreate', (code) => {
    const expirationTime = 5 * 60 * 1000;

    setTimeout(async () => {
      try {
        await Code.destroy({
          where: { id: code.id }
        });
        console.log(`Código ${code.id} eliminado después de 5 minutos.`);
      } catch (error) {
        console.error(`Error al eliminar código ${code.id}:`, error);
      }
    }, expirationTime);
  });

  return Code;
}