const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const userData = sequelize.define('user_model',{
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        trim: true
    },
    number: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    employee_id: {
        type: DataTypes.STRING
    },
    user_group: {
        type: DataTypes.STRING,
        defaultValue: 'user' // Setting a default value
    },
    userImage: {
        type: DataTypes.STRING,
        allowNull: true // Assuming userImage can be null
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true
    },
    state: {
        type: DataTypes.STRING,
        allowNull: true
    },
    pincode: {
        type: DataTypes.STRING,
        allowNull: true
    },
    country: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, { timestamps: false });

sequelize.sync().then(() => {
    console.log("user table created")
}).catch((err) => {
    console.error("Error creating user table:", err);
});

module.exports = userData;
