// const axios = require('axios');
// require('dotenv').config();
// const apikey = process.env.OPENAI_API_KEY
// async function fetchAIResponse(prompt) {
//     try {
//         const response = await axios.post(
//             'https://api.openai.com/v1/chat/completions',
//             {
//                 model: 'gpt-3.5-turbo',
//                 messages: [
//                     {
//                         role: 'system',
//                         content: 'You are an IELTS writing evaluator. Evaluate the essay based on Task Achievement, Coherence & Cohesion, Lexical Resource, and Grammatical Range & Accuracy. Provide a band score and feedback.',
//                     },
//                     {
//                         role: 'user',
//                         content: prompt,
//                     },
//                 ],
//             },
//             {
//                 headers: {
//                     'Authorization': `Bearer ${apikey}`,
//                     'Content-Type': 'application/json',
//                 },
//             }
//         );

//         // Return AI response content (evaluation)
//         return response.data.choices[0].message.content;

//     } catch (error) {
//         console.error('Error fetching AI response:', error.message);
//         throw new Error('Failed to fetch AI response'); // Throwing error for higher-level catch
//     }
// }


// function extractBandScore(evaluationText) {
//     const scoreMatch = evaluationText.match(/Band (\d+)/);
//     return scoreMatch ? parseInt(scoreMatch[1]) : 0;
// }


// function extractFeedback(evaluationText) {
//     const feedbackMatch = evaluationText.match(/Feedback:\s*(.*)/);
//     return feedbackMatch ? feedbackMatch[1] : 'No feedback available';
// }

// module.exports = {
//     fetchAIResponse,
//     extractBandScore,
//     extractFeedback
// };



require('dotenv').config();
const axios = require('axios');
const apikey = process.env.DEEPCSEEK_API_KEY; // Use DeepSeek API Key
console.log(apikey)

async function fetchDeepSeekResponse(prompt) {
    try {
        // Make sure the request URL and payload match DeepSeek's requirements
        const response = await axios.post(
            'https://api.deepseek.ai/v1/essay-evaluation',  // Replace with correct URL
            {
                text: prompt, // Body parameter to send essay
                language: 'en', // Language parameter, adjust if needed
                evaluation_type: 'IELTS',  // If DeepSeek expects this specific field
            },
            {
                headers: {
                    'Authorization': `Bearer ${apikey}`, // API key for authentication
                    'Content-Type': 'application/json',  // JSON body type
                },
            }
        );

        // Log the full response to understand its structure
        console.log('DeepSeek Response:', response.data);

        // Assuming the structure of the response contains 'evaluation' field
        // Adjust the field names if necessary based on actual API response structure
        return response.data.evaluation || response.data;  // Ensure we return evaluation or the whole response if needed

    } catch (error) {
        console.error('Error fetching DeepSeek response:', error.message);

        // Log full error details
        if (error.response) {
            console.error('DeepSeek API Error Response:', error.response.data);
        } else if (error.request) {
            console.error('No response received from DeepSeek:', error.request);
        } else {
            console.error('Error setting up request:', error.message);
        }

        throw new Error('Failed to fetch DeepSeek response');
    }
}

// Function to extract the band score from the evaluation text
function extractBandScore(evaluationText) {
    const scoreMatch = evaluationText.match(/Band (\d+)/);
    return scoreMatch ? parseInt(scoreMatch[1]) : 0;
}

// Function to extract feedback from the evaluation text
function extractFeedback(evaluationText) {
    const feedbackMatch = evaluationText.match(/Feedback:\s*(.*)/);
    return feedbackMatch ? feedbackMatch[1] : 'No feedback available';
}

module.exports = {
    fetchDeepSeekResponse,
    extractBandScore,
    extractFeedback
};
