const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("User", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    direccion: {
      type: DataTypes.JSON,
    },
    rol: {
      type: DataTypes.STRING,
      defaultValue: "user"
    },
    vendedor: {
      type: DataTypes.STRING,
      defaultValue: "noVendedor"
    },
    averageRating: {
      type: DataTypes.FLOAT,
      defaultValue: 0, 
    },
    origin: {
      type: DataTypes.STRING,
      defaultValue: "DB"
    },
  },
  {
    paranoid: true,
    deletedAt: 'Deshabilitado'
  });
};

