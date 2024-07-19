const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const PipelineField = sequelize.define('pipeline_field', {
    field_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    createdById : {
        type: DataTypes.STRING,
        allowNull: false
    },
    isDeleted:{
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
    
});

module.exports = PipelineField;