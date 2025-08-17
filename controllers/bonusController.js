const { generateContent } = require('../services/geminiService');

async function generateBonuses(req, res) {
  // Handle both 'input' and 'userInput' parameters for compatibility
  const userInput = req.body.userInput || req.body.input;

  if (!userInput) {
    return res.status(400).json({ error: 'userInput or input is required' });
  }

  const prompt = `Act as an expert marketer. Based on the customer pain points and annoying steps described below, generate 3 high-value bonuses that directly solve these specific problems and add tremendous value to the main offer.

Customer Pain Points: "${userInput}"

Return exactly 3 bonus suggestions as a JSON array of strings like this:
["bonus 1", "bonus 2", "bonus 3"]`;

  try {
    console.log('Generating bonuses for:', userInput);
    const aiResponse = await generateContent(prompt);
    
    // Ensure we have an array
    const suggestionsArray = Array.isArray(aiResponse) ? aiResponse : [];
    
    // Transform the AI response into the format expected by frontend
    const suggestions = suggestionsArray.slice(0, 3).map((text, index) => ({
      id: `bonus_${index + 1}`,
      text: typeof text === 'string' ? text.trim() : String(text).trim()
    }));

    // Fallback if we don't have enough suggestions
    if (suggestions.length === 0) {
      console.log('No bonus suggestions generated, using fallback');
      const fallbackSuggestions = [
        { id: 'bonus_1', text: 'BONUS #1: Exclusive Access to our Private Mastermind Community ($497 value) - Connect with like-minded entrepreneurs and get ongoing support.' },
        { id: 'bonus_2', text: 'BONUS #2: Complete Template Library ($297 value) - Ready-to-use templates, scripts, and frameworks that save you 100+ hours.' },
        { id: 'bonus_3', text: 'BONUS #3: Monthly Group Coaching Calls ($197/month value) - Get direct access to expert guidance and personalized feedback.' }
      ];
      return res.json({ suggestions: fallbackSuggestions });
    }

    console.log('Successfully generated bonus suggestions:', suggestions);
    res.json({ suggestions });
  } catch (error) {
    console.error('Bonuses generation error:', error);
    
    // Return fallback suggestions in case of error
    const fallbackSuggestions = [
      { id: 'bonus_1', text: 'BONUS #1: Exclusive Access to our Private Mastermind Community ($497 value) - Connect with like-minded entrepreneurs and get ongoing support.' },
      { id: 'bonus_2', text: 'BONUS #2: Complete Template Library ($297 value) - Ready-to-use templates, scripts, and frameworks that save you 100+ hours.' },
      { id: 'bonus_3', text: 'BONUS #3: Monthly Group Coaching Calls ($197/month value) - Get direct access to expert guidance and personalized feedback.' }
    ];
    
    res.json({ suggestions: fallbackSuggestions });
  }
}

module.exports = { generateBonuses };
