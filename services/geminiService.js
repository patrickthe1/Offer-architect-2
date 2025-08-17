const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateContent(prompt) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Raw AI response:', text);
    
    // Try multiple ways to extract the suggestions
    let suggestions = [];
    
    // Method 1: Try to extract JSON from markdown code block
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[1]);
        suggestions = parsed.suggestions || parsed;
      } catch (e) {
        console.log('Failed to parse JSON from code block');
      }
    }
    
    // Method 2: Try to parse the entire response as JSON
    if (suggestions.length === 0) {
      try {
        const parsed = JSON.parse(text);
        suggestions = parsed.suggestions || parsed;
      } catch (e) {
        console.log('Failed to parse entire response as JSON');
      }
    }
    
    // Method 3: Look for array-like patterns in text
    if (suggestions.length === 0) {
      const arrayMatch = text.match(/\[([\s\S]*?)\]/);
      if (arrayMatch) {
        try {
          const parsed = JSON.parse(arrayMatch[0]);
          suggestions = parsed;
        } catch (e) {
          console.log('Failed to parse array from text');
        }
      }
    }
    
    // Method 4: Split by common patterns (fallback)
    if (suggestions.length === 0) {
      // Look for numbered lists or bullet points
      const lines = text.split('\n').filter(line => line.trim());
      suggestions = lines
        .filter(line => /^[\d\-\*\+]/.test(line.trim()))
        .map(line => line.replace(/^[\d\-\*\+\.\s]+/, '').trim())
        .filter(line => line.length > 0);
    }
    
    console.log('Extracted suggestions:', suggestions);
    return suggestions;
    
  } catch (error) {
    console.error('Error generating content:', error);
    throw new Error(`Failed to generate content from AI: ${error.message}`);
  }
}

module.exports = { generateContent };
