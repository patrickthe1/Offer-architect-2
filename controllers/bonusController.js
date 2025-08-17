const { generateContent } = require('../services/geminiService');

// Premium guided questions for bonus strategy development
const getGuidedQuestions = () => {
  return [
    {
      id: 'bonus-obstacles',
      title: 'What obstacles do your customers face AFTER purchasing your main offer?',
      subtitle: 'Think about the roadblocks that prevent them from getting results',
      placeholder: 'Example: They lack the time to implement, need accountability, get overwhelmed by choices, struggle with technical setup...',
      coachingTip: 'The best bonuses solve the problems that would prevent your customers from succeeding with your main offer.'
    },
    {
      id: 'bonus-timevalue',
      title: 'What would save your customers the most TIME and EFFORT?',
      subtitle: 'Focus on tools, templates, or shortcuts that accelerate their success',
      placeholder: 'Example: Done-for-you templates, step-by-step checklists, automation tools, ready-made systems...',
      coachingTip: 'Time-saving bonuses are incredibly valuable. People will pay premium prices to save time and avoid tedious work.'
    },
    {
      id: 'bonus-expertise',
      title: 'What expertise or access would be impossible for them to get elsewhere?',
      subtitle: 'Think exclusive content, personal access, or insider knowledge',
      placeholder: 'Example: Private community access, monthly Q&A calls, exclusive case studies, insider contacts...',
      coachingTip: 'Exclusive access creates scarcity and perceived value. Make them feel like VIPs.'
    }
  ];
};

// Advanced bonus generation with psychology-based strategies
async function generateAdvancedBonuses(answers) {
  const prompt = `You are Alex Hormozi, the master of irresistible offers. Based on the customer insights below, create 5 premium bonuses that make this offer impossible to refuse.

CUSTOMER INSIGHTS:
- Obstacles After Purchase: "${answers.obstacles || 'General implementation challenges'}"
- Time/Effort Savers Needed: "${answers.timevalue || 'Templates and shortcuts'}"
- Exclusive Expertise Desired: "${answers.expertise || 'Expert guidance and access'}"

Apply these PROVEN BONUS STRATEGIES:

1. STACK VALUE PSYCHOLOGY: Each bonus should feel worth more than the main offer price
2. OBSTACLE ELIMINATION: Address every reason they might fail or not get results
3. TIME COMPRESSION: Save them months/years of work and trial-and-error
4. EXCLUSIVE ACCESS: Give them something they can't get anywhere else
5. SCARCITY ELEMENTS: Limited-time, limited-access, or limited-quantity items

BONUS TYPES TO CONSIDER:
- Implementation Tools (templates, checklists, scripts)
- Expert Access (calls, community, mentorship)
- Educational Resources (courses, case studies, training)
- Time Savers (done-for-you materials, automation)
- Exclusive Content (insider secrets, advanced strategies)

Return a JSON array with exactly 5 bonus objects. Each bonus must have:
- "title": Compelling bonus name with value proposition
- "description": 2-3 sentences explaining the bonus and its value
- "value": Specific dollar value (be generous but believable)
- "urgency": Scarcity/urgency element
- "outcome": Specific result this bonus delivers

Format: [{"title": "...", "description": "...", "value": "...", "urgency": "...", "outcome": "..."}]`;

  try {
    const aiResponse = await generateContent(prompt);
    return Array.isArray(aiResponse) ? aiResponse : [];
  } catch (error) {
    console.error('Advanced bonus generation error:', error);
    return [];
  }
}

// Analyze bonus stack strength and provide optimization suggestions
async function analyzeBonusStrength(answers) {
  const analysisPrompt = `As Alex Hormozi, analyze this bonus strategy and rate its psychological impact:

BONUS STRATEGY INPUTS:
- Customer Obstacles: "${answers.obstacles || 'Not specified'}"
- Time/Value Savers: "${answers.timevalue || 'Not specified'}"
- Exclusive Elements: "${answers.expertise || 'Not specified'}"

Provide a JSON analysis with:
{
  "score": 1-10 (overall bonus strategy strength),
  "strengths": ["strength1", "strength2"],
  "improvements": ["improvement1", "improvement2"],
  "psychologyTips": ["tip1", "tip2"],
  "valueMultiplier": "X.X" (estimated value multiplier effect)
}`;

  try {
    const analysis = await generateContent(analysisPrompt);
    return analysis || {
      score: 7,
      strengths: ["Addresses customer needs", "Provides additional value"],
      improvements: ["Add more specific time savings", "Include exclusive access elements"],
      psychologyTips: ["Stack value higher than main offer", "Create urgency with limited access"],
      valueMultiplier: "2.5"
    };
  } catch (error) {
    console.error('Bonus analysis error:', error);
    return {
      score: 7,
      strengths: ["Addresses customer needs", "Provides additional value"],
      improvements: ["Add more specific time savings", "Include exclusive access elements"],
      psychologyTips: ["Stack value higher than main offer", "Create urgency with limited access"],
      valueMultiplier: "2.5"
    };
  }
}

// Main bonus generation endpoint (legacy compatibility)
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

// Premium guided bonus questions endpoint
async function getBonusQuestions(req, res) {
  try {
    const questions = getGuidedQuestions();
    res.json({ questions });
  } catch (error) {
    console.error('Error getting bonus questions:', error);
    res.status(500).json({ error: 'Failed to get bonus questions' });
  }
}

// Premium guided bonus generation endpoint
async function generateGuidedBonuses(req, res) {
  try {
    const { answers } = req.body;
    
    if (!answers || typeof answers !== 'object') {
      return res.status(400).json({ error: 'Guided answers are required' });
    }

    console.log('Generating premium bonuses with guided answers:', answers);

    // Generate bonuses and analysis in parallel
    const [bonuses, analysis] = await Promise.all([
      generateAdvancedBonuses(answers),
      analyzeBonusStrength(answers)
    ]);

    // Ensure we have valid bonuses
    const validBonuses = Array.isArray(bonuses) ? bonuses.slice(0, 5) : [];
    
    // Fallback bonuses if generation fails
    if (validBonuses.length === 0) {
      const fallbackBonuses = [
        {
          title: "BONUS #1: Implementation Accelerator Pack ($497 value)",
          description: "Complete templates, checklists, and scripts that eliminate guesswork and save you 40+ hours of setup time. Get results faster than ever before.",
          value: "$497",
          urgency: "Limited to first 100 customers only",
          outcome: "Skip the learning curve and implement immediately"
        },
        {
          title: "BONUS #2: VIP Mentorship Access ($297/month value)",
          description: "Monthly group coaching calls with direct expert guidance. Get your questions answered and obstacles removed in real-time.",
          value: "$297/month",
          urgency: "Available only during launch week",
          outcome: "Never feel stuck or alone in your journey"
        },
        {
          title: "BONUS #3: Exclusive Insider Community ($197 value)",
          description: "Private mastermind group with like-minded achievers. Network, collaborate, and get ongoing support from peers who understand your goals.",
          value: "$197",
          urgency: "Closing to new members December 31st",
          outcome: "Build valuable relationships and accountability"
        }
      ];
      
      return res.json({
        bonuses: fallbackBonuses,
        analysis: analysis || { score: 7, strengths: [], improvements: [], psychologyTips: [], valueMultiplier: "2.5" }
      });
    }

    console.log('Successfully generated premium bonuses:', validBonuses.length);
    res.json({
      bonuses: validBonuses,
      analysis: analysis
    });

  } catch (error) {
    console.error('Premium bonus generation error:', error);
    res.status(500).json({ error: 'Failed to generate premium bonuses' });
  }
}

module.exports = { 
  generateBonuses,
  getBonusQuestions,
  generateGuidedBonuses
};
