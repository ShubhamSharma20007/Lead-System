const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

module.exports  = sequelize.define('pipeline_user_permission', {
    user_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    pipeline_id : {
        type: DataTypes.STRING,
        allowNull: false
    },
    
});

