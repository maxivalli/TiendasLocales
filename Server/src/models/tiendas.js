const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "Tienda",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        unique: true,
      },
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      indicaciones: {
        type: DataTypes.STRING,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      direccion: {
        type: DataTypes.JSON,
      },
      habilitado: {
        type: DataTypes.STRING,
        defaultValue: "noHabilitado",
      },
      averageRating: {
        type: DataTypes.FLOAT,
      },
      categoria: {
        type: DataTypes.STRING,
      },
      horarios: {
        type: DataTypes.JSON,
      },
      dias: {
        type: DataTypes.STRING,
      },
      facebook: {
        type: DataTypes.STRING,
      },
      instagram: {
        type: DataTypes.STRING,
      },
      whatsapp: {
        type: DataTypes.STRING,
      },
      isOpen: {
        type: DataTypes.BOOLEAN,
      },
    },
    {
      paranoid: true,
      deletedAt: "Deshabilitado",
    }
  );
};
