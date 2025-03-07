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


// const { fetchGoogleAIResponse, extractBandScore, extractFeedback, extractMistakes } = require('./evaluation.controllers');
// const UserWritingAnswer = require('../models/UserWritingAnswer.model'); 
// const writingtest = require('../models/writingtest.model')



// const addWritingAnswer = async (req, res) => {
//     try {
//         const { userId, testId, answers } = req.body;

//         // Validate input
//         if (!userId || !testId || !Array.isArray(answers) || answers.length === 0) {
//             return res.status(400).json({ message: 'userId, testId, and answers (array) are required' });
//         }

//         for (let answer of answers) {
//             if (!answer.taskId || !answer.userResponse) {
//                 return res.status(400).json({ message: 'taskId and userResponse are required for each answer' });
//             }
//         }
//         // Fetch the question from the database based on taskId
//         const task = await writingtest.findOne({ where: { id: answer.taskId } });

//         if (!task) {
//             return res.status(404).json({ message: `Task with id ${answer.taskId} not found` });
//         }

//         const question = task.question; 

//         const evaluationPrompt = `IELTS Writing Task Evaluation:\n\n**Question:** ${question}\n\n**User Response:** ${answer.userResponse}`;


//         const evaluation = await fetchGoogleAIResponse(evaluationPrompt);
//         console.log(evaluation)


//         const userAnswer = await UserWritingAnswer.bulkCreate(
//             answers.map(answer => ({
//                 userId,
//                 testId,
//                 taskId: answer.taskId,
//                 userResponse: answer.userResponse
//             }))
//         );


//         // Send success response
//         res.status(201).json({
//             message: 'Answers submitted successfully and evaluated',
//             data: userAnswer
//         });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Server error: ' + error.message });
//     }
// };


// module.exports = {
//     addWritingAnswer
// };


const { fetchGoogleAIResponse, extractBandScore, extractFeedback, extractMistakes } = require('./evaluation.controllers');
const writingtest = require('../models/writingtest.model'); // Writing test model

// Controller for adding user answers and evaluating them (without saving to DB)
const addWritingAnswer = async (req, res) => {
    try {
        const { userId, testId, answers } = req.body;

        // Validate input
        if (!userId || !testId || !Array.isArray(answers) || answers.length === 0) {
            return res.status(400).json({ message: 'userId, testId, and answers (array) are required' });
        }

        let evaluations = []; // Store evaluations to return in response

        // Process and evaluate each answer
        for (const answer of answers) {
            if (!answer.taskId || !answer.userResponse) {
                return res.status(400).json({ message: 'taskId and userResponse are required for each answer' });
            }

            // ✅ Move fetching the question **inside** the loop
            const task = await writingtest.findOne({ where: { id: answer.taskId } });

            if (!task) {
                return res.status(404).json({ message: `Task with id ${answer.taskId} not found` });
            }

            const question = task.question; // Fetch the corresponding question

            // Combine the question and response for AI evaluation
            const evaluationPrompt = `IELTS Writing Task Evaluation:\n\n**Question:** ${question}\n\n**User Response:** ${answer.userResponse}`;

            // Fetch AI evaluation from Google Gemini
            try {
                const evaluation = await fetchGoogleAIResponse(evaluationPrompt);

                // Extract structured details from AI response
                const bandScore = extractBandScore(evaluation);
                const feedback = extractFeedback(evaluation);
                const mistakes = extractMistakes(evaluation);

                // Store evaluation result
                evaluations.push({
                    taskId: answer.taskId,
                    question,
                    userResponse: answer.userResponse,
                    bandScore,
                    feedback,
                    mistakes
                });

            } catch (error) {
                return res.status(500).json({ message: 'AI Evaluation Failed', error: error.message });
            }
        }

        // Send evaluation response
        res.status(200).json({
            message: 'Answers evaluated successfully',
            evaluations
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
};

module.exports = {
    addWritingAnswer
};
