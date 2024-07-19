const {DataTypes} = require('sequelize')
const sequelize = require('../config/database')
    const Activity = sequelize.define('activity_dashboard', {
        lead_id:{
            type:DataTypes.STRING,
            allowNull:false
        },
        activity:{
            type:DataTypes.STRING,
            allowNull:false
        }
    },{timestamps:true})
  
module.exports = Activity;