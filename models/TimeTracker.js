const DataTypes = require('sequelize');
const sequelize = require('../config/database');
const TimeTracker = sequelize.define('time_tracker', {
        userId:{
            type:DataTypes.STRING,
            allowNull:false
        },
        taskName:{
            type:DataTypes.STRING,
            allowNull:false
        },
        startTime:{
            type:DataTypes.TIME,
            allowNull:false
        },
        endTime:{
            type:DataTypes.TIME,
            allowNull:false
        },
        totalTime:{
            type:DataTypes.INTEGER,
            allowNull:false
         
        }
},{timestamps:true})

module.exports = TimeTracker;