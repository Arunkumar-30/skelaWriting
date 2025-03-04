const User = require("./user.model");
const Test = require("./test.model");
const WritingTask = require("./writingtest.model");
const UserWritingAnswer = require("./UserWritingAnswer.model");
const Score = require("./score.model");



Test.hasMany(WritingTask, { foreignKey: "testId" });
WritingTask.belongsTo(Test, { foreignKey: "testId" });
User.hasMany(UserWritingAnswer, { foreignKey: "userId" });
UserWritingAnswer.belongsTo(User, { foreignKey: "userId" });
Test.hasMany(UserWritingAnswer, { foreignKey: "testId" });
UserWritingAnswer.belongsTo(Test, { foreignKey: "testId" });
WritingTask.hasMany(UserWritingAnswer, { foreignKey: "taskId" });
UserWritingAnswer.belongsTo(WritingTask, { foreignKey: "taskId" });
User.hasMany(Score, { foreignKey: "userId" });
Score.belongsTo(User, { foreignKey: "userId" });
Test.hasMany(Score, { foreignKey: "testId" });
Score.belongsTo(Test, { foreignKey: "testId" });
WritingTask.hasMany(Score, { foreignKey: "taskId" });
Score.belongsTo(WritingTask, { foreignKey: "taskId" });


module.exports = {
    User,
    Test,
    WritingTask,
    UserWritingAnswer,
    Score
}