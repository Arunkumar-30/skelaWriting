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

const apikey = process.env.GOOGLE_GEMINI_API_KEY; // Use Google AI Studio API Key
console.log(apikey);

async function fetchGoogleAIResponse(prompt) {
    try {
        const apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

        // Make request to Google AI Studio (Gemini API)
        const response = await axios.post(
            apiUrl,
            {
                contents: [{ role: 'user', parts: [{ text: `Evaluate this IELTS essay and provide a band score with feedback: ${prompt}` }] }],
            },
            {
                headers: {
                    'Authorization': `Bearer ${apikey}`,
                    'Content-Type': 'application/json',
                },
                params: {
                    key: apikey, // API key passed as query parameter
                },
            }
        );

        console.log('Google AI Response:', response.data);

        // Extract text response from Google's Gemini API
        const evaluationText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response received';

        return evaluationText;

    } catch (error) {
        console.error('Error fetching Google AI response:', error.message);

        if (error.response) {
            console.error('Google AI API Error Response:', error.response.data);
        } else if (error.request) {
            console.error('No response received from Google AI:', error.request);
        } else {
            console.error('Error setting up request:', error.message);
        }

        throw new Error('Failed to fetch Google AI response');
    }
}

// Function to extract the band score from the evaluation text
function extractBandScore(evaluationText) {
    const scoreMatch = evaluationText.match(/Band (\d+(\.\d+)?)/); // Supports decimal scores
    return scoreMatch ? parseFloat(scoreMatch[1]) : 0;
}

// Function to extract feedback from the evaluation text
function extractFeedback(evaluationText) {
    const feedbackMatch = evaluationText.match(/Feedback:\s*(.*)/);
    return feedbackMatch ? feedbackMatch[1] : 'No feedback available';
}

module.exports = {
    fetchGoogleAIResponse,
    extractBandScore,
    extractFeedback
};
