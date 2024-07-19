
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const LeadData = sequelize.define('leads', {
    Id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique:true,
        autoIncrement: true
    },
    companyName: {
        type: DataTypes.STRING,
    },
    Stage:{
        type: DataTypes.STRING,
    },
    Amount:
    {
        type: DataTypes.STRING,
    },
    EndDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    pipeline_Id:{
        type:DataTypes.INTEGER,  //previous number
        allowNull:false
    },
    ContactNumber: {
        type: DataTypes.STRING,
        defaultValue: '0'
    },
    StartDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    Source:{
        type: DataTypes.STRING,
    },
    target_status: {
        type: DataTypes.STRING,
        defaultValue:"New Lead"
    },
    remind_days:{
        type:DataTypes.DATE
    },
    responsible_person: {
        type: DataTypes.STRING,
        allowNull: false
    },
    loginEmail:{
        type: DataTypes.STRING,
        allowNull: false
    },
    employee_id: {
        type: DataTypes.STRING,
        allowNull: false
    },

    resume:{
        type:DataTypes.STRING,
        defaultValue:null
    },
    isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false // Default value is false (not deleted)
    },
    updatedTime: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW 
    },
    contactId:{
        type: DataTypes.STRING,
        defaultValue :0
    }

});




module.exports = LeadData;


