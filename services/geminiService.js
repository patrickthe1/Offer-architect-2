const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateContent(prompt) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract the JSON string from the markdown code block
    const jsonString = text.match(/```json\n([\s\S]*?)\n```/)[1];
    return JSON.parse(jsonString).suggestions;
  } catch (error) {
    console.error('Error generating content:', error);
    throw new Error('Failed to generate content from AI');
  }
}

module.exports = { generateContent };
