const {DataTypes} = require("sequelize");
const sequelize = require("../config/database");


const SelectDataModal = sequelize.define('select_dropdown_modal',{
   id:{
    type:DataTypes.INTEGER,
    allowNull:false,
    autoIncrement:true,
    primaryKey:true
   },
   labelName:{
    type:DataTypes.STRING,
    allowNull:false
   },
   value:{
    type:DataTypes.STRING,
    allowNull:false,
   
   }


})
module.exports =SelectDataModal;