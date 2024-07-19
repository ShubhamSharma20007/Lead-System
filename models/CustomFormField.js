const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const CustomFormField = sequelize.define('custom_form_field', {
    labelName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    divId: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'div_id' // Use field option to specify the column name in the database
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    // customAttribute: {
    //     type: DataTypes.STRING,
    //     allowNull: false
    // }
}, {
    timestamps: false,
    tableName: 'custom_form_field' // Specify the table name explicitly
});

sequelize.sync().then(() => {
    console.log("custom_form_field table created");
}).catch((err) => {
    console.log(err);
});

module.exports = CustomFormField;
