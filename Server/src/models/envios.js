const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define("Envio", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: {
            type: DataTypes.INTEGER,
        },
        secondUserId: {
            type: DataTypes.INTEGER,
        },
        ubication: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        date: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });
};
