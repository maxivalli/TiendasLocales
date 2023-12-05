// userFavorites.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("UserFavorites", {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    favoriteUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
};

