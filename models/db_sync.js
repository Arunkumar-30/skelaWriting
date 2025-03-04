const Sequelize = require('../config/db_config');
const Test = require('./test.model'); // Import all models
const WritingTask = require('./writingtest.model');
const UserWritingAnswer = require('./UserWritingAnswer.model');
const Score = require('./score.model');
const User = require('./user.model');

const modelInt = async () => {
    try {
        console.log('Attempting to sync the database...');

        await Sequelize.sync({ force: false, alter: true });
        // await Sequelize.sync({ force: true });
        console.log('Database synced successfully. Tables created/updated.');
    } catch (error) {
        console.error('Error while syncing the database:', error);
    }
};

module.exports = modelInt;
