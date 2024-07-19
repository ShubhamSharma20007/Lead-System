const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");


const CalendarEvent = sequelize.define("calendar_event", {
    eventname:{
        type:DataTypes.STRING
    },
    eventdate:{
        type:DataTypes.DATEONLY
    }
},{timestamps:true})

module.exports = CalendarEvent