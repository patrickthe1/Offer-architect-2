const { generateContent } = require('../services/geminiService');

// Guided question system for Guarantees
const guidedQuestions = [
  {
    id: 'customer-fears',
    question: "What's the #1 thing your customer is afraid will happen if they try your product?",
    context: "This fear is the foundation of your guarantee. The stronger the fear, the more powerful your guarantee.",
    placeholder: "e.g., It will be too complicated, waste their time, not work for their specific situation, they'll look foolish",
    coaching: "Think beyond logical concerns - what keeps them awake at night about making this decision?"
  },
  {
    id: 'past-failures',
    question: "What have they tried before that didn't work or disappointed them?",
    context: "Understanding their past disappointments helps create guarantees that address specific trust issues.",
    placeholder: "e.g., Other software that was overly complex, courses that didn't deliver results, services that over-promised",
    coaching: "Their skepticism comes from being burned before. What promises were broken?"
  },
  {
    id: 'biggest-objection',
    question: "What's the most common reason prospects don't buy from you right now?",
    context: "Your guarantee should directly eliminate this objection and reverse the risk completely.",
    placeholder: "e.g., Price concerns, skepticism about results, timing issues, technical complexity fears",
    coaching: "This objection is what stands between you and the sale. Your guarantee should make it irrelevant."
  }
];

// Enhanced AI prompting with Hormozi's guarantee psychology
async function generateAdvancedGuarantees(guidedAnswers) {
  const prompt = `You are Alex Hormozi's personal guarantee consultant and a master of risk reversal psychology. Your job is to create guarantees that eliminate every shred of customer doubt.

CONTEXT:
- Customer's Biggest Fear: "${guidedAnswers.customerFears}"
- Past Failures/Disappointments: "${guidedAnswers.pastFailures}"
- Main Purchase Objection: "${guidedAnswers.biggestObjection}"

Using Hormozi's risk reversal principles and advanced buyer psychology, create 3 guarantee offers that:

1. REVERSE EVERY RISK: Not just money back - eliminate ALL their fears
2. OVERCOMPENSATE: Go beyond fair - make NOT buying the risky choice
3. SPECIFIC & BELIEVABLE: Concrete terms that feel real and achievable
4. HANDLE OBJECTIONS: Directly address their past disappointments
5. CREATE URGENCY: Make them feel foolish for waiting

PSYCHOLOGY RULES:
- Use "fear of loss" language (what they'll miss if they don't act)
- Include specific timeframes and measurable outcomes
- Add penalty/reward elements that favor the customer
- Reference their past failures to show this is different
- Make the guarantee itself a selling point

FORMAT: Return exactly 3 guarantees as a JSON array. Each should be 2-3 sentences maximum.

EXAMPLE QUALITY:
Instead of: "30-day money back guarantee"
Use: "The 'Zero-Risk Transformation' Guarantee: If you don't see measurable results in 30 days, not only do we refund every penny, but we'll also pay for your next solution AND give you our complete competitor research (worth $500) so you don't waste more time."

Return the 3 guarantees as a JSON array of strings:`;

  try {
    const response = await generateContent(prompt);
    return response;
  } catch (error) {
    console.error('Advanced guarantee generation failed:', error);
    throw error;
  }
}

// Analyze and score guarantee strength
function analyzeGuaranteeStrength(guarantee) {
  const analysis = {
    score: 0,
    strengths: [],
    improvements: [],
    riskReversalLevel: 'basic'
  };

  // Check for specific timeframes
  const timeWords = ['day', 'days', 'week', 'weeks', 'month', 'months', '30', '60', '90'];
  const hasTimeframe = timeWords.some(word => 
    guarantee.toLowerCase().includes(word)
  );
  
  if (hasTimeframe) {
    analysis.score += 20;
    analysis.strengths.push("Includes specific timeframe");
  } else {
    analysis.improvements.push("Add specific timeframe for credibility");
  }

  // Check for risk reversal beyond money
  const riskReversalWords = ['pay for', 'cover', 'bonus', 'extra', 'compensation', 'penalty'];
  const hasAdvancedReversal = riskReversalWords.some(word => 
    guarantee.toLowerCase().includes(word)
  );
  
  if (hasAdvancedReversal) {
    analysis.score += 30;
    analysis.strengths.push("Goes beyond basic money-back");
    analysis.riskReversalLevel = 'advanced';
  } else {
    analysis.improvements.push("Consider going beyond basic refund");
  }

  // Check for measurable outcomes
  const measureWords = ['results', 'increase', 'improve', 'achieve', 'reach', 'specific'];
  const hasMeasurables = measureWords.some(word => 
    guarantee.toLowerCase().includes(word)
  );
  
  if (hasMeasurables) {
    analysis.score += 25;
    analysis.strengths.push("Includes measurable outcomes");
  } else {
    analysis.improvements.push("Add specific measurable outcomes");
  }

  // Check for emotional/psychological elements
  const emotionWords = ['confident', 'peace of mind', 'worry', 'stress', 'fear', 'doubt'];
  const hasEmotion = emotionWords.some(word => 
    guarantee.toLowerCase().includes(word)
  );
  
  if (hasEmotion) {
    analysis.score += 25;
    analysis.strengths.push("Addresses emotional concerns");
  } else {
    analysis.improvements.push("Add emotional/psychological elements");
  }

  return analysis;
}

// Main endpoint for guided guarantee generation
async function generateGuarantees(req, res) {
  try {
    const { userInput, guidedAnswers } = req.body;
    
    console.log('Received guarantee request:', req.body);

    // Handle legacy single input format
    if (userInput && !guidedAnswers) {
      console.log('Legacy guarantee format detected, upgrading...');
      
      const enhancedPrompt = `Transform this basic input into a powerful risk-reversal guarantee using Alex Hormozi's principles:

Input: "${userInput}"

Create 3 guarantees that eliminate customer fear and reverse all risk.
Return as JSON array of strings.`;

      const aiResponse = await generateContent(enhancedPrompt);
      const suggestionsArray = Array.isArray(aiResponse) ? aiResponse : [];
      
      const suggestions = suggestionsArray.slice(0, 3).map((text, index) => ({
        id: `guarantee_${index + 1}`,
        text: typeof text === 'string' ? text.trim() : String(text).trim(),
        analysis: analyzeGuaranteeStrength(text),
        coaching: "💡 For even stronger guarantees, try the guided approach!"
      }));

      return res.json({ 
        suggestions,
        recommendUpgrade: true,
        message: "Good start! For premium risk-reversal, try our guided system."
      });
    }

    // Validate guided answers
    if (!guidedAnswers || !guidedAnswers.customerFears || !guidedAnswers.pastFailures || !guidedAnswers.biggestObjection) {
      return res.status(400).json({ 
        error: 'All guided questions must be answered: customerFears, pastFailures, biggestObjection' 
      });
    }

    console.log('Generating advanced guarantees with guided system:', guidedAnswers);

    // Generate advanced guarantees
    const aiResponse = await generateAdvancedGuarantees(guidedAnswers);
    const suggestionsArray = Array.isArray(aiResponse) ? aiResponse : [];
    
    // Transform and analyze each suggestion
    const suggestions = suggestionsArray.slice(0, 3).map((text, index) => {
      const cleanText = typeof text === 'string' ? text.trim() : String(text).trim();
      const analysis = analyzeGuaranteeStrength(cleanText);
      
      return {
        id: `guarantee_${index + 1}`,
        text: cleanText,
        analysis: analysis,
        psychologyNote: getGuaranteePsychology(cleanText, analysis),
        whyItWorks: generateGuaranteeWhy(cleanText, guidedAnswers),
        riskLevel: analysis.riskReversalLevel
      };
    });

    // Fallback if no suggestions generated
    if (suggestions.length === 0) {
      const fallbackSuggestions = generateGuaranteeFallback(guidedAnswers);
      return res.json({ suggestions: fallbackSuggestions });
    }

    console.log('Successfully generated advanced guarantees:', suggestions.length);
    
    res.json({ 
      suggestions,
      guidance: generateGuaranteeGuidance(suggestions),
      confidence: calculateGuaranteeConfidence(suggestions)
    });

  } catch (error) {
    console.error('Guarantee generation error:', error);
    
    const fallbackSuggestions = [
      {
        id: 'guarantee_1',
        text: 'The "Zero-Risk Success" Guarantee: If you don\'t see the results we promise within 60 days, we\'ll refund every penny AND personally help you find a solution that works.',
        analysis: { score: 75, strengths: ['timeframe', 'goes beyond refund'] },
        whyItWorks: 'Eliminates all purchase risk while showing confidence in results'
      }
    ];
    
    res.json({ 
      suggestions: fallbackSuggestions,
      fallback: true,
      message: "Using premium fallback guarantees - all systems operational"
    });
  }
}

// Helper functions
function getGuaranteePsychology(guarantee, analysis) {
  if (analysis.riskReversalLevel === 'advanced') {
    return "🛡️ This reverses ALL risk - making NOT buying the dangerous choice";
  } else if (analysis.score >= 60) {
    return "💪 Good risk reversal - builds confidence in your offer";
  } else {
    return "⚠️ This feels like a standard guarantee - could be much stronger";
  }
}

function generateGuaranteeWhy(guarantee, guidedAnswers) {
  return `This directly addresses their fear of "${guidedAnswers.customerFears}" while differentiating from past failures like "${guidedAnswers.pastFailures}" and eliminating their main objection: "${guidedAnswers.biggestObjection}".`;
}

function generateGuaranteeGuidance(suggestions) {
  const avgScore = suggestions.reduce((sum, s) => sum + s.analysis.score, 0) / suggestions.length;
  
  if (avgScore >= 75) {
    return "🚀 Excellent risk reversal! These guarantees eliminate customer fear and create urgency. Choose the one that fits your business model.";
  } else if (avgScore >= 50) {
    return "👍 Good foundation! Consider adding more specific outcomes or going beyond basic refunds.";
  } else {
    return "💪 Let's strengthen these. The best guarantees make customers feel foolish for NOT buying.";
  }
}

function calculateGuaranteeConfidence(suggestions) {
  const avgScore = suggestions.reduce((sum, s) => sum + s.analysis.score, 0) / suggestions.length;
  return Math.round(avgScore);
}

function generateGuaranteeFallback(guidedAnswers) {
  return [
    {
      id: 'guarantee_1',
      text: `The "No-Risk Success" Guarantee: If we don't eliminate your fear of "${guidedAnswers.customerFears}" within 60 days, we'll refund you completely AND cover your next solution.`,
      analysis: { score: 70, strengths: ['addresses specific fear', 'goes beyond refund'] },
      whyItWorks: 'Directly targets their biggest concern while showing complete confidence'
    }
  ];
}

// Export guided questions for frontend
const getGuidedQuestions = (req, res) => {
  res.json({ questions: guidedQuestions });
};

module.exports = { 
  generateGuarantees, 
  getGuidedQuestions
};
