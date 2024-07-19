const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(
    'newschema_db',
    'root',
    'Shubu@123',
    {
       host: 'localhost',
       dialect: 'mysql'
    }
 );

// const sequelize = new Sequelize(
//    'lead_scaleedge1',
//    'lead_scaleedge1',
//    'Qwe123!@#',
//    {
//       host: '43.239.192.246',
//       dialect: 'mysql'
//    }
// );
 
sequelize.authenticate().then(() => {
   console.log('Connection has been established successfully.');
}).catch((error) => {
   console.error('Unable to connect to the database: ', error);
});

module.exports = sequelize;

