const storeScoreControllers = require('../models/score.model');

const storeScore = async (req, res) => {
    try {
        const { userId, testId, scores } = req.body;

        if (!userId || !testId || !scores || !Array.isArray(scores)) {
            return res.status(400).json({ message: 'userId, testId, and scores (array) are required' });
        }

        for (let scoreData of scores) {
            const { taskId, score, feedback } = scoreData;
            if (!taskId || score === undefined || !feedback) {
                return res.status(400).json({ message: 'taskId, score, and feedback are required for each entry' });
            }
        }

        const newScores = await storeScoreControllers.bulkCreate(
            scores.map(scoreData => ({
                userId,
                testId,
                taskId: scoreData.taskId,
                score: scoreData.score,
                feedback: scoreData.feedback
            }))
        );

        res.status(201).json({
            message: 'Scores and feedback stored successfully',
            data: newScores
        });
    } catch (error) {
        console.error('Error storing scores:', error);
        res.status(500).json({ message: error.message });
    }
};

// fetchall score
const fetchAllScore = async (req, res) => {
    try {
        const score = await storeScoreControllers.findAll()
        res.status(201).json(score)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// fetch single score
const fetchSingleScore = async (req, res) => {
    try {
        const { userId } = req.params;
        const scoreId = await storeScoreControllers.findAll({ where: { userId } });
        if (!scoreId || scoreId.length === 0) {
            return res.status(404).json({ message: 'user id not found' })
        }
        res.status(201).json(scoreId)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}



// const storeScore = async (req, res) => {
//     try {
//         const { userId, testId, taskId, prompt, evaluation } = req.body;
//         if (!userId || !testId || !taskId || !prompt || !evaluation) {
//             return res.status(400).json({ message: 'userId, testId, taskId, prompt, and evaluation are required' });
//         }
//         const { bandScore, feedback } = evaluation; 

//         const newScore = await storeScoreControllers.create({
//             userId,
//             testId,
//             taskId,
//             score: bandScore, 
//             feedback: feedback 
//         });
//         res.status(201).json({
//             message: 'Score and feedback stored successfully',
//             data: newScore
//         });
//     } catch (error) {
//         console.error('Error storing score:', error);
//         res.status(500).json({ message: 'Server error: ' + error.message });
//     }
// };



module.exports = { storeScore, fetchAllScore, fetchSingleScore };
