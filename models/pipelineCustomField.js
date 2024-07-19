const {DataTypes} = require('sequelize')
const sequelize = require('../config/database')
    const PipelineCustomField = sequelize.define('pipeline_custome_field', {
        field_name:{
            type:DataTypes.STRING,
            allowNull:false
        },
        pipeline_select_id:{
            type:DataTypes.STRING,
            allowNull:false
        }
    },{timestamps:true})
  
module.exports = PipelineCustomField;