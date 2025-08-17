const { generateContent } = require('../services/geminiService');

async function generateGuarantees(req, res) {
  // Handle both 'input' and 'userInput' parameters for compatibility
  const userInput = req.body.userInput || req.body.input;

  if (!userInput) {
    return res.status(400).json({ error: 'userInput or input is required' });
  }

  const prompt = `Act as an expert marketer. Based on the customer fears or doubts described below, generate 3 bold, risk-reversal guarantees that address these concerns and make the offer irresistible.

Customer Fears/Doubts: "${userInput}"

Return exactly 3 guarantee suggestions as a JSON array of strings like this:
["guarantee 1", "guarantee 2", "guarantee 3"]`;

  try {
    console.log('Generating guarantees for:', userInput);
    const aiResponse = await generateContent(prompt);
    
    // Ensure we have an array
    const suggestionsArray = Array.isArray(aiResponse) ? aiResponse : [];
    
    // Transform the AI response into the format expected by frontend
    const suggestions = suggestionsArray.slice(0, 3).map((text, index) => ({
      id: `guarantee_${index + 1}`,
      text: typeof text === 'string' ? text.trim() : String(text).trim()
    }));

    // Fallback if we don't have enough suggestions
    if (suggestions.length === 0) {
      console.log('No guarantee suggestions generated, using fallback');
      const fallbackSuggestions = [
        { id: 'guarantee_1', text: '30-Day Money-Back Guarantee: If you don\'t see measurable results within 30 days, get a full refund - no questions asked.' },
        { id: 'guarantee_2', text: 'Success Guarantee: We\'ll work with you until you achieve your first major milestone, or we\'ll refund every penny.' },
        { id: 'guarantee_3', text: 'Double-Your-Investment Guarantee: If this doesn\'t pay for itself within 90 days, we\'ll refund double what you paid.' }
      ];
      return res.json({ suggestions: fallbackSuggestions });
    }

    console.log('Successfully generated guarantee suggestions:', suggestions);
    res.json({ suggestions });
  } catch (error) {
    console.error('Guarantees generation error:', error);
    
    // Return fallback suggestions in case of error
    const fallbackSuggestions = [
      { id: 'guarantee_1', text: '30-Day Money-Back Guarantee: If you don\'t see measurable results within 30 days, get a full refund - no questions asked.' },
      { id: 'guarantee_2', text: 'Success Guarantee: We\'ll work with you until you achieve your first major milestone, or we\'ll refund every penny.' },
      { id: 'guarantee_3', text: 'Double-Your-Investment Guarantee: If this doesn\'t pay for itself within 90 days, we\'ll refund double what you paid.' }
    ];
    
    res.json({ suggestions: fallbackSuggestions });
  }
}

module.exports = { generateGuarantees };
