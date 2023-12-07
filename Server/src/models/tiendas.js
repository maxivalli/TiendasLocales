const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("Tienda", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
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
      type: DataTypes.STRING
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    direccion: {
      type: DataTypes.STRING,
    },
    habilitado: {
      type: DataTypes.STRING,
      defaultValue: "noHabilitado"
    },
    averageRating: {
      type: DataTypes.FLOAT,
      defaultValue: 0, 
    },
    categoria:{
    type: DataTypes.STRING,
    },
    horarios: {
      type: DataTypes.STRING,
    },
    facebook:{
      type: DataTypes.STRING
    },
    instagram:{
      type: DataTypes.STRING
    },
    whatsapp:{
      type: DataTypes.STRING
    }
  },
  {
    paranoid: true,
    deletedAt: 'Deshabilitado'
  });
};

