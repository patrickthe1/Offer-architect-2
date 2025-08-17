const { generateContent } = require('../services/geminiService');

async function generateGuarantees(req, res) {
  const { userInput } = req.body;

  if (!userInput) {
    return res.status(400).json({ error: 'userInput is required' });
  }

  const prompt = `Act as an expert marketer. Generate 3 bold, risk-reversal guarantees based on the following user input. Return the output as a JSON object with a key "suggestions".\n\nUser Input: "${userInput}"`;

  try {
    const suggestions = await generateContent(prompt);
    res.json({ suggestions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { generateGuarantees };
