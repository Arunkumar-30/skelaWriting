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
        allowNull: null,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    testId: {
        type: DataTypes.INTEGER,
        allowNull: true,  // Change to false if every section must belong to a test
        references: {
            model: 'Tests',
            key: 'id'
        }
    },
    taskId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'WritingTasks',
            key: 'id'
        }
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
