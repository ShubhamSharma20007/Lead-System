const {DataTypes} = require('sequelize')
const sequelize = require('../config/database')
    const RouterPath = sequelize.define('allroute', {
      page_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      active: {
        type: DataTypes.ENUM('y', 'n'),
        defaultValue: 'y'
      }
    },{timestamps:true})
  
module.exports = RouterPath;