const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Message = sequelize.define('message', {
    fromId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fromName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    toId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    toName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});

module.exports = Message;