const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const CustomCheckboxModel  = sequelize.define('custom_checkbox',{
    fieldName:{
        type:DataTypes.STRING,
        allowNull:false
    },
    type:{
        type : DataTypes.STRING,
        allowNull:false     
    },
    name:{
        type : DataTypes.STRING,
        allowNull:false     
    },
    ischecked:{
        type : DataTypes.BOOLEAN,
        defaultValue:false
    }
},{timestamps:true})

module.exports = CustomCheckboxModel;