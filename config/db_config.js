const Sequelize = require('sequelize')

const sequelize = new Sequelize('skela_writing', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql',
    dialectModule: require('mysql2'),
});

module.exports = sequelize;
