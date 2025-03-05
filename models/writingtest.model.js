const { DataTypes } = require('sequelize');
const Sequelize = require('../config/db_config');

const WritingTask = Sequelize.define("WritingTasks", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
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
    },
    testId: {
        type: DataTypes.INTEGER,
        allowNull: true, // set to false if a Section must always belong to a Test
        references: {
            model: 'Tests', // make sure this matches the table name for Test
            key: 'id'
        }
    },

}
);

// If you need to define associations, you can do it here
WritingTask.associate = (models) => {
    WritingTask.belongsTo(models.Test, { foreignKey: "testId" });
};

// Return the WritingTask model at the end
module.exports = WritingTask;
