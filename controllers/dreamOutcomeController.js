const { generateContent } = require('../services/geminiService');

async function generateDreamOutcome(req, res) {
  // Handle both 'input' and 'userInput' parameters for compatibility
  const userInput = req.body.userInput || req.body.input;

  if (!userInput) {
    return res.status(400).json({ error: 'userInput or input is required' });
  }

  const prompt = `Act as an expert marketer. Rephrase the following user input into 3 more powerful "Dream Outcome" statements. Each suggestion should be emotionally resonant and clearly articulate the ultimate result the customer will achieve.

User Input: "${userInput}"

Return exactly 3 suggestions as a JSON array of strings like this:
["suggestion 1", "suggestion 2", "suggestion 3"]`;

  try {
    console.log('Generating dream outcomes for:', userInput);
    const aiResponse = await generateContent(prompt);
    
    // Ensure we have an array
    const suggestionsArray = Array.isArray(aiResponse) ? aiResponse : [];
    
    // Transform the AI response into the format expected by frontend
    const suggestions = suggestionsArray.slice(0, 3).map((text, index) => ({
      id: `dream_${index + 1}`,
      text: typeof text === 'string' ? text.trim() : String(text).trim()
    }));

    // Fallback if we don't have enough suggestions
    if (suggestions.length === 0) {
      console.log('No suggestions generated, using fallback');
      const fallbackSuggestions = [
        { id: 'dream_1', text: 'Transform your business into a profit-generating machine that works systematically and predictably.' },
        { id: 'dream_2', text: 'Achieve complete financial control and clarity that gives you confidence in every business decision.' },
        { id: 'dream_3', text: 'Build a scalable system that generates consistent results without constant oversight.' }
      ];
      return res.json({ suggestions: fallbackSuggestions });
    }

    console.log('Successfully generated suggestions:', suggestions);
    res.json({ suggestions });
  } catch (error) {
    console.error('Dream Outcome generation error:', error);
    
    // Return fallback suggestions in case of error
    const fallbackSuggestions = [
      { id: 'dream_1', text: 'Transform your business into a profit-generating machine that works systematically and predictably.' },
      { id: 'dream_2', text: 'Achieve complete financial control and clarity that gives you confidence in every business decision.' },
      { id: 'dream_3', text: 'Build a scalable system that generates consistent results without constant oversight.' }
    ];
    
    res.json({ suggestions: fallbackSuggestions });
  }
}

module.exports = { generateDreamOutcome };
