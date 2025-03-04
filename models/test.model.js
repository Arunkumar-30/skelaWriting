const { DataTypes } = require('sequelize');
const Sequelize = require('../config/db_config');

const Test = Sequelize.define('Tests', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    // image: {
    //     type: DataTypes.STRING,
    //     allowNull: true
    // },
    duration: {
        type: DataTypes.INTEGER,
        defaultValue: 30
    }
});


module.exports = Test;

