const { DataTypes } = require('sequelize');
const Sequelize = require('../config/db_config');

const WritingTask = Sequelize.define("WritingTasks", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    testId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    taskType: {
        type: DataTypes.ENUM("Task 1", "Task 2"),
        allowNull: false
    },
    prompt: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
    }
});

// If you need to define associations, you can do it here
WritingTask.associate = (models) => {
    WritingTask.belongsTo(models.Test, { foreignKey: "testId" });
};

// Return the WritingTask model at the end
module.exports = WritingTask;
