const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define("Compra", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        postId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        unit_price: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        currency_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        }, 
        storeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }, 
        productImage: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        delivery: {
            type: DataTypes.BOOLEAN,
        }, 
        userDireccion: {
            type: DataTypes.JSON,
        }, 
        enviado: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        eliminado: {
            type: DataTypes.STRING,
        },
    });
};
