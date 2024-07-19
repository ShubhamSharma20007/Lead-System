const {DataTypes} = require('sequelize')
const sequelize = require('../config/database')
    const Product = sequelize.define('products_table', {
        productName:{
            type:DataTypes.STRING,
            allowNull:false
        },   
        pipeline_Id :{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        createdPersonId:{
            type:DataTypes.INTEGER,
            allowNull:false
        }  
    },{timestamps:true})
  
module.exports = Product;