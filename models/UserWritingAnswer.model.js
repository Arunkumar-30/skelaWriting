const { DataTypes } = require('sequelize');
const Sequelize = require('../config/db_config');

const UserWritingAnswer = Sequelize.define("UserWritingAnswers", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
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
    userResponse: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});

// Define associations (uncomment if you want them directly in the model file)
UserWritingAnswer.associate = (models) => {
    UserWritingAnswer.belongsTo(models.User, { foreignKey: "userId" });
    UserWritingAnswer.belongsTo(models.Test, { foreignKey: "testId" });
    UserWritingAnswer.belongsTo(models.WritingTask, { foreignKey: "taskId" });
};

// Return the model
module.exports = UserWritingAnswer;
