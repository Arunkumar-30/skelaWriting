// const { fetchAIResponse,
//     extractBandScore,
//     extractFeedback } = require('./evaluation.controllers')
// const UserWritingAnswerControllers = require('../models/UserWritingAnswer.model')
// const { storeScore } = require('../controllers/score.controllers').storeScore;


// submit answer controllers
// const addWritingAnswer = async (req, res) => {
//     try {
//         const { userId, testId, answers } = req.body;

//         if (!userId || !testId || !answers || !Array.isArray(answers)) {
//             return res.status(404).json({ message: 'userid,testid,taskid,userresponse are required' })
//         }
//         for (let answer of answers) {
//             const { taskId, userResponse } = answer
//             if (!taskId || !userResponse) {
//                 return res.status(404).json({ message: 'taskid and userreponse is required' })
//             }
//         }
//         const userAnswer = await UserWritingAnswerControllers.bulkCreate(
//             answers.map(answer => ({
//                 userId,
//                 testId,
//                 taskId: answer.taskId,
//                 userResponse: answer.userResponse
//             }))

//         )
//         res.status(201).json(userAnswer)
//     } catch (error) {
//         console.log(error)
//         res.status(500).json({ message: error.message })
//     }
// }



// const addWritingAnswer = async (req, res) => {
//     try {
//         const { userId, testId, answers } = req.body;
//         if (!userId || !testId || !answers || !Array.isArray(answers)) {
//             return res.status(400).json({ message: 'userId, testId, and answers (array) are required' });
//         }
//         for (let answer of answers) {
//             const { taskId, userResponse } = answer;
//             if (!taskId || !userResponse) {
//                 return res.status(400).json({ message: 'taskId and userResponse are required for each answer' });
//             }
//         }
//         const userAnswer = await UserWritingAnswerControllers.bulkCreate(
//             answers.map(answer => ({
//                 userId,
//                 testId,
//                 taskId: answer.taskId,
//                 userResponse: answer.userResponse
//             }))
//         );

//         for (let answer of answers) {
//             const prompt = answer.userResponse;
//             const evaluation = await fetchAIResponse(prompt); 
//             const bandScore = extractBandScore(evaluation);
//             const feedback = extractFeedback(evaluation);
//             await storeScore({
//                 body: {
//                     userId,
//                     testId,
//                     taskId: answer.taskId,
//                     prompt,
//                     evaluation: { bandScore, feedback }
//                 }
//             }, res); 
//         }

//         res.status(201).json({
//             message: 'Answers submitted successfully and scores stored',
//             data: userAnswer
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Server error: ' + error.message });
//     }
// };




// module.exports = { addWritingAnswer }
const { fetchDeepSeekResponse, extractBandScore, extractFeedback } = require('./evaluation.controllers'); // Import the DeepSeek service
const UserWritingAnswerControllers = require('../models/UserWritingAnswer.model'); // Assuming this is your DB model for storing answers

// Controller for adding user answers and evaluating them
const addWritingAnswer = async (req, res) => {
    try {
        const { userId, testId, answers } = req.body;

        // Check if required fields are provided
        if (!userId || !testId || !answers || !Array.isArray(answers)) {
            return res.status(400).json({ message: 'userId, testId, and answers (array) are required' });
        }

        // Validate each answer has taskId and userResponse
        for (let answer of answers) {
            const { taskId, userResponse } = answer;
            if (!taskId || !userResponse) {
                return res.status(400).json({ message: 'taskId and userResponse are required for each answer' });
            }
        }

        // Store answers in the database (bulk insert)
        const userAnswer = await UserWritingAnswerControllers.bulkCreate(
            answers.map(answer => ({
                userId,
                testId,
                taskId: answer.taskId,
                userResponse: answer.userResponse
            }))
        );

        // Process each answer and fetch evaluation from DeepSeek
        for (let answer of answers) {
            const prompt = answer.userResponse;

            // Fetch AI response (evaluation) from DeepSeek
            const evaluation = await fetchDeepSeekResponse(prompt);

            // Extract band score and feedback from evaluation response
            const bandScore = extractBandScore(evaluation);
            const feedback = extractFeedback(evaluation);

            // Store the score and feedback (assuming you have a method to store it)
            await storeScore({
                body: {
                    userId,
                    testId,
                    taskId: answer.taskId,
                    prompt,
                    evaluation: { bandScore, feedback }
                }
            }, res);
        }

        // Send a successful response
        res.status(201).json({
            message: 'Answers submitted successfully and scores stored',
            data: userAnswer
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
};

// Function to store scores (you can adjust it depending on your database model)
async function storeScore({ body }, res) {
    try {
        const { userId, testId, taskId, prompt, evaluation } = body;

        // Example of saving score and feedback into the database
        await UserWritingAnswerControllers.create({
            userId,
            testId,
            taskId,
            prompt,
            bandScore: evaluation.bandScore,
            feedback: evaluation.feedback
        });

        res.status(200).json({ message: 'Score and feedback saved successfully' });
    } catch (error) {
        console.error('Error saving score:', error);
        res.status(500).json({ message: 'Failed to save score: ' + error.message });
    }
}

module.exports = {
    addWritingAnswer
};
