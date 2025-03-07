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

const apikey = "AIzaSyBADxJPDHu3GLbY2nU-m6ZtkDnbCo6wNjU"; // Google AI Studio API Key


// Generate a structured IELTS Writing Evaluation Prompt
function generateIELTSEvaluationPrompt(userResponse) {
    return `Evaluate this IELTS Writing Task response strictly based on IELTS scoring criteria:
    
    1. **Band Score (0-9)**
    2. **Detailed Feedback on Coherence, Cohesion, Grammar, and Lexical Resource**
    3. **List of Mistakes with Corrections**
    
    ---
    
    **User Response:**  
    "${userResponse}"
    
    Provide a structured response with headings for each section.
    `;
}

async function fetchGoogleAIResponse(userResponse) {
    try {
        const prompt = generateIELTSEvaluationPrompt(userResponse);
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apikey}`; // ✅ Ensure this is correct

        const response = await axios.post(
            apiUrl,
            {
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );

        console.log('Google AI Response:', response.data);

        return response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response received';

    } catch (error) {
        console.error('Error fetching Google AI response:', error.message);
        if (error.response) console.error('Google AI API Error Response:', error.response.data);
        throw new Error('Failed to fetch Google AI response');
    }
}


// Extract Band Score from AI Response
function extractBandScore(evaluationText) {
    const match = evaluationText.match(/Band Score:\s*(\d+(\.\d+)?)/i);
    return match ? parseFloat(match[1]) : null;
}

// Extract Feedback from AI Response
function extractFeedback(evaluationText) {
    const match = evaluationText.match(/Feedback:\s*(.+)/i);
    return match ? match[1] : 'No feedback provided';
}

// Extract Mistakes from AI Response
function extractMistakes(evaluationText) {
    const match = evaluationText.match(/Mistakes:\s*(.+)/i);
    return match ? match[1] : 'No mistakes detected';
}

module.exports = {
    fetchGoogleAIResponse,
    extractBandScore,
    extractFeedback,
    extractMistakes
};
