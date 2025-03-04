const { DataTypes } = require('sequelize');
const Sequelize = require('../config/db_config');

const Score = Sequelize.define("Scores", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    testId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    taskId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    score: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    feedback: {
        type: DataTypes.TEXT
    }
});

// Define associations (if needed, uncomment and modify these associations)
Score.associate = (models) => {
    // Associating Score with User, Test, and WritingTask
    Score.belongsTo(models.User, { foreignKey: "userId" });
    Score.belongsTo(models.Test, { foreignKey: "testId" });
    Score.belongsTo(models.WritingTask, { foreignKey: "taskId" });
};

// Return the model
module.exports = Score;
