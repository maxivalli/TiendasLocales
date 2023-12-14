// userFavorites.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("Favorites", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    storeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    postId: {
      type: DataTypes.INTEGER,
    }
  });
};

