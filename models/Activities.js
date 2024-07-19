const {DataTypes} = require('sequelize')
const sequelize = require('../config/database')
    const Activities = sequelize.define('activities', {
        lead_id:{
            type:DataTypes.STRING,
            allowNull:false
        },
        activity:{
            type:DataTypes.STRING,
            allowNull:false
        },
        dateTime:{
            type:DataTypes.DATE,
            allowNull:false,
            defaultValue: DataTypes.NOW 
        },
        activityStatus:{
            type:DataTypes.STRING,
            allowNull:false,
            defaultValue: 'Planned'
        }
    },{timestamps:true})
  
module.exports = Activities;