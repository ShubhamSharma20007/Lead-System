const {DataTypes} = require('sequelize')
const sequelize = require('../config/database')
const LeadProduct = sequelize.define('lead_product', {
    leadFk: {
        type: DataTypes.STRING,
    },
    pipeline_id:{
        type: DataTypes.INTEGER,
        allowNull:false
    },
    createdPersonId:{
        type:DataTypes.INTEGER,
        allowNull:false
    },  
    product_name: {
    type: DataTypes.STRING,
    },
    product_quantity: {
    type: DataTypes.STRING,
    },
    product_price :{
    type: DataTypes.INTEGER,
    },
    product_total_price: {
    type: DataTypes.INTEGER,
    },
},
{timestamps:true}
)



  
module.exports = LeadProduct;


