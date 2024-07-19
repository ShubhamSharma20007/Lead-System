const {DataTypes} = require("sequelize");
const sequelize = require("../config/database");

const CustomField = sequelize.define('custom_field', {
    Id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    containerId:{
        type :DataTypes.STRING,
        unique:true,
        notNull:true
    },
    fieldName:{
        type :DataTypes.STRING,
        allowNull : false,
        unique: true,
    },
    previousField:{
        type :DataTypes.STRING,
        allowNull : false,
    }
})
module.exports = CustomField;
