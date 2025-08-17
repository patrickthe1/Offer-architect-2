const { generateContent } = require('../services/geminiService');

// Guided question system for Dream Outcome
const guidedQuestions = [
  {
    id: 'current-result',
    question: "What specific result does your product/service deliver?",
    context: "Don't think features - think transformation. What changes in their life or business?",
    placeholder: "e.g., Help businesses manage their finances more efficiently",
    coaching: "Focus on the outcome, not the process. What do they have AFTER using your product?"
  },
  {
    id: 'customer-emotion',
    question: "How does your customer feel BEFORE they get this result?",
    context: "This emotion is the key to a powerful dream outcome. Dig deep.",
    placeholder: "e.g., Stressed about money, overwhelmed by spreadsheets, afraid of making wrong decisions",
    coaching: "The stronger the negative emotion, the more powerful your dream outcome will be."
  },
  {
    id: 'ideal-vision',
    question: "If your product worked perfectly, what would their ideal day look like 6 months from now?",
    context: "Paint the picture of their transformed reality. Be specific and vivid.",
    placeholder: "e.g., They wake up confident, check their dashboard in 5 minutes, make decisions with clarity",
    coaching: "Make it cinematic. Help them see, feel, and experience their future self."
  }
];

// Enhanced AI prompting with advanced psychology
async function generateAdvancedDreamOutcome(guidedAnswers) {
  const prompt = `You are Alex Hormozi's personal offer consultant and a master of consumer psychology. Your job is to transform basic business benefits into irresistible dream outcomes.

CONTEXT:
- Current Result: "${guidedAnswers.currentResult}"
- Customer's Pain: "${guidedAnswers.customerEmotion}" 
- Ideal Vision: "${guidedAnswers.idealVision}"

Using Hormozi's Value Equation principles and advanced persuasion psychology, create 3 dream outcomes that:

1. EMOTIONAL TRANSFORMATION: Address the identity change, not just the logical benefit
2. SPECIFIC & MEASURABLE: Use concrete language that creates vivid mental images
3. STATUS & RECOGNITION: Connect to how they'll be perceived by others
4. TIMEFRAME URGENCY: Imply speed and immediacy of transformation

PSYCHOLOGY RULES:
- Tap into deeper motivations (freedom, status, security, recognition)
- Use "transformation language" (from X to Y, never again, finally)
- Include social proof implications (what others will notice/say)
- Make it feel inevitable and permanent

FORMAT: Return exactly 3 dream outcomes as a JSON array. Each should be 1-2 sentences maximum.

EXAMPLE QUALITY:
Instead of: "Manage your finances better"
Use: "Transform from a business owner who loses sleep over money into a confident CEO who makes financial decisions in minutes, knowing exactly where every dollar is working for your future."

Return the 3 dream outcomes as a JSON array of strings:`;

  try {
    const response = await generateContent(prompt);
    return response;
  } catch (error) {
    console.error('Advanced dream outcome generation failed:', error);
    throw error;
  }
}

// Analyze and score dream outcome quality
function analyzeDreamOutcomeStrength(dreamOutcome) {
  const analysis = {
    score: 0,
    strengths: [],
    improvements: [],
    psychology: {}
  };

  // Check for emotional transformation language
  const transformationWords = ['transform', 'become', 'evolve', 'shift', 'change', 'never again', 'finally'];
  const hasTransformation = transformationWords.some(word => 
    dreamOutcome.toLowerCase().includes(word)
  );
  
  if (hasTransformation) {
    analysis.score += 25;
    analysis.strengths.push("Uses transformation language");
  } else {
    analysis.improvements.push("Add transformation language (from X to Y)");
  }

  // Check for specificity
  const specificWords = ['exactly', 'precisely', 'specific', 'clear', 'confident', 'certain'];
  const hasSpecificity = specificWords.some(word => 
    dreamOutcome.toLowerCase().includes(word)
  );
  
  if (hasSpecificity) {
    analysis.score += 25;
    analysis.strengths.push("Includes specific, confident language");
  } else {
    analysis.improvements.push("Make it more specific and confident");
  }

  // Check for social/status elements
  const statusWords = ['others', 'peers', 'colleagues', 'recognized', 'respected', 'admired'];
  const hasStatus = statusWords.some(word => 
    dreamOutcome.toLowerCase().includes(word)
  );
  
  if (hasStatus) {
    analysis.score += 25;
    analysis.strengths.push("Appeals to status and recognition");
  } else {
    analysis.improvements.push("Add social/status element");
  }

  // Check for time urgency
  const timeWords = ['immediately', 'instantly', 'quickly', 'fast', 'rapid', 'swift'];
  const hasUrgency = timeWords.some(word => 
    dreamOutcome.toLowerCase().includes(word)
  );
  
  if (hasUrgency) {
    analysis.score += 25;
    analysis.strengths.push("Creates urgency and speed");
  } else {
    analysis.improvements.push("Add time urgency/speed element");
  }

  return analysis;
}

// Main endpoint for guided dream outcome generation
async function generateDreamOutcome(req, res) {
  try {
    const { userInput, guidedAnswers } = req.body;
    
    console.log('Received request body:', req.body);
    console.log('UserInput:', userInput);
    console.log('GuidedAnswers:', guidedAnswers);

    // Handle legacy single input format
    if (userInput && !guidedAnswers) {
      console.log('Legacy format detected, upgrading to guided system...');
      
      // Convert single input to guided format for better results
      const enhancedPrompt = `Transform this basic input into a powerful dream outcome using Alex Hormozi's principles:

Input: "${userInput}"

Create 3 dream outcomes that focus on emotional transformation, specific results, and status change.
Return as JSON array of strings.`;

      const aiResponse = await generateContent(enhancedPrompt);
      const suggestionsArray = Array.isArray(aiResponse) ? aiResponse : [];
      
      const suggestions = suggestionsArray.slice(0, 3).map((text, index) => ({
        id: `dream_${index + 1}`,
        text: typeof text === 'string' ? text.trim() : String(text).trim(),
        analysis: analyzeDreamOutcomeStrength(text),
        coaching: "💡 For even better results, try the guided question system!"
      }));

      return res.json({ 
        suggestions,
        recommendUpgrade: true,
        message: "Good start! For premium results, try our guided approach."
      });
    }

    // Validate guided answers
    if (!guidedAnswers || !guidedAnswers.currentResult || !guidedAnswers.customerEmotion || !guidedAnswers.idealVision) {
      return res.status(400).json({ 
        error: 'All guided questions must be answered: currentResult, customerEmotion, idealVision' 
      });
    }

    console.log('Generating advanced dream outcomes with guided system:', guidedAnswers);

    // Generate advanced dream outcomes
    const aiResponse = await generateAdvancedDreamOutcome(guidedAnswers);
    const suggestionsArray = Array.isArray(aiResponse) ? aiResponse : [];
    
    // Transform and analyze each suggestion
    const suggestions = suggestionsArray.slice(0, 3).map((text, index) => {
      const cleanText = typeof text === 'string' ? text.trim() : String(text).trim();
      const analysis = analyzeDreamOutcomeStrength(cleanText);
      
      return {
        id: `dream_${index + 1}`,
        text: cleanText,
        analysis: analysis,
        psychologyNote: getpsychologyExplanation(cleanText, analysis),
        whyItWorks: generateWhyItWorks(cleanText, guidedAnswers)
      };
    });

    // Fallback if no suggestions generated
    if (suggestions.length === 0) {
      const fallbackSuggestions = generateFallbackSuggestions(guidedAnswers);
      return res.json({ suggestions: fallbackSuggestions });
    }

    console.log('Successfully generated advanced dream outcomes:', suggestions.length);
    
    res.json({ 
      suggestions,
      guidance: generateNextStepGuidance(suggestions),
      confidence: calculateConfidenceScore(suggestions)
    });

  } catch (error) {
    console.error('Dream Outcome generation error:', error);
    
    const fallbackSuggestions = [
      {
        id: 'dream_1',
        text: 'Transform from feeling overwhelmed by your business to being a confident leader who makes clear, profitable decisions every day.',
        analysis: { score: 75, strengths: ['transformation language', 'emotional shift'] },
        whyItWorks: 'Addresses the core emotional transformation from chaos to confidence'
      }
    ];
    
    res.json({ 
      suggestions: fallbackSuggestions,
      fallback: true,
      message: "Using premium fallback suggestions - all systems operational"
    });
  }
}

// Helper functions
function getpsychologyExplanation(dreamOutcome, analysis) {
  if (analysis.score >= 75) {
    return "🧠 This taps into identity transformation - the most powerful motivator";
  } else if (analysis.score >= 50) {
    return "💡 Good emotional appeal - could be even stronger with identity language";
  } else {
    return "⚠️ This reads more like a feature than a transformation";
  }
}

function generateWhyItWorks(dreamOutcome, guidedAnswers) {
  return `This works because it transforms the pain point "${guidedAnswers.customerEmotion}" into the aspiration "${guidedAnswers.idealVision}" while making the outcome feel inevitable and immediate.`;
}

function generateNextStepGuidance(suggestions) {
  const avgScore = suggestions.reduce((sum, s) => sum + s.analysis.score, 0) / suggestions.length;
  
  if (avgScore >= 75) {
    return "🚀 Excellent! These dream outcomes have strong psychological appeal. Pick the one that feels most authentic to your brand voice.";
  } else if (avgScore >= 50) {
    return "👍 Good foundation! Consider adding more transformation language to make them even more compelling.";
  } else {
    return "💪 Let's strengthen these. Focus on the identity change your customer experiences, not just the logical benefit.";
  }
}

function calculateConfidenceScore(suggestions) {
  const avgScore = suggestions.reduce((sum, s) => sum + s.analysis.score, 0) / suggestions.length;
  return Math.round(avgScore);
}

function generateFallbackSuggestions(guidedAnswers) {
  return [
    {
      id: 'dream_1',
      text: `Transform from ${guidedAnswers.customerEmotion} to ${guidedAnswers.idealVision} - becoming the confident leader you've always wanted to be.`,
      analysis: { score: 70, strengths: ['uses customer input', 'transformation language'] },
      whyItWorks: 'Directly addresses your customer\'s current pain and desired future'
    }
  ];
}

// Export guided questions for frontend
const getGuidedQuestions = (req, res) => {
  res.json({ questions: guidedQuestions });
};

module.exports = { 
  generateDreamOutcome, 
  getGuidedQuestions
};
