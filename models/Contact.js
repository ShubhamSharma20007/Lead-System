const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");


const Contact = sequelize.define("contact", {
    name:{
        type:DataTypes.STRING
    },
    pipelineId:{
        type:DataTypes.STRING
    },
    email:{
        type:DataTypes.STRING
    },
    mobile:{
        type:DataTypes.STRING
    },
    address:{
        type:DataTypes.STRING
    }
},{timestamps:true})

module.exports = Contact