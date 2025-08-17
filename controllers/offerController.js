const { generateContent } = require('../services/geminiService');

// AI-powered pricing strategy analysis
async function analyzePricingStrategy(pricingDescription, offerData) {
  const prompt = `You are Alex Hormozi, the master of pricing psychology and irresistible offers. Analyze this pricing strategy and provide strategic recommendations.

OFFER CONTEXT:
- Dream Outcome: "${offerData.dreamOutcome || 'Transform business results'}"
- Guarantee: "${offerData.guarantee || 'Risk-free guarantee'}"
- Bonuses: "${offerData.bonus || 'Additional value bonuses'}"

PRICING DESCRIPTION: "${pricingDescription}"

IMPORTANT: Respond with ONLY a valid JSON object. No markdown, no code blocks, no extra text. Use this exact format:

{
  "recommendedPrice": "$2,997",
  "priceJustification": "This price uses psychological anchoring and positions you as premium",
  "valueStackTotal": "$7,500",
  "pricingStrategy": "psychology-based",
  "improvements": ["Add payment plan option", "Create urgency with limited spots"],
  "psychologyTips": ["Use charm pricing ending in 7", "Show value comparison"],
  "confidenceScore": 8,
  "alternativePricing": [
    {"model": "One-time", "price": "$2,997", "pros": ["Higher profit margins"], "cons": ["Higher barrier to entry"]},
    {"model": "Payment plan", "price": "3x $1,097", "pros": ["Lower barrier to entry"], "cons": ["Payment processing complexity"]}
  ]
}`;

  try {
    const rawResponse = await generateContent(prompt);
    console.log('Raw pricing analysis response:', rawResponse);
    
    // Enhanced JSON parsing for pricing analysis
    let analysis = null;
    
    if (typeof rawResponse === 'string') {
      // Remove code blocks and extra formatting
      let cleanResponse = rawResponse
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .replace(/^[^{]*/, '') // Remove text before first {
        .replace(/[^}]*$/, '') // Remove text after last }
        .trim();
      
      try {
        analysis = JSON.parse(cleanResponse);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        console.log('Attempted to parse:', cleanResponse);
      }
    } else if (typeof rawResponse === 'object') {
      analysis = rawResponse;
    }
    
    // Validate the analysis structure
    if (analysis && analysis.recommendedPrice && analysis.confidenceScore) {
      return analysis;
    } else {
      console.log('Invalid analysis structure, using fallback');
      return getDefaultPricingAnalysis();
    }
  } catch (error) {
    console.error('Pricing analysis error:', error);
    return getDefaultPricingAnalysis();
  }
}

// Generate premium offer copy with strategic pricing
async function generatePremiumOffer(offerData, pricingAnalysis) {
  const prompt = `You are Alex Hormozi creating an irresistible offer. Using the components below, craft a compelling sales offer that follows proven conversion psychology.

OFFER COMPONENTS:
- Dream Outcome: "${offerData.dreamOutcome}"
- Guarantee: "${offerData.guarantee}"
- Bonuses: "${offerData.bonus}"
- Recommended Price: "${pricingAnalysis.recommendedPrice}"
- Value Stack Total: "${pricingAnalysis.valueStackTotal}"

PSYCHOLOGICAL PRINCIPLES TO APPLY:
1. Value Stacking (show total value vs. price)
2. Scarcity/Urgency (limited time/quantity)
3. Social Proof Elements
4. Risk Reversal (guarantee prominence)
5. Clear Call-to-Action

Create a compelling offer that includes:
- Attention-grabbing headline
- Clear value proposition
- Detailed value stack breakdown
- Price justification
- Urgency/scarcity elements
- Strong guarantee placement
- Compelling call-to-action

Return as formatted text (not JSON).`;

  try {
    const offerCopy = await generateContent(prompt);
    return offerCopy || generateFallbackOffer(offerData, pricingAnalysis);
  } catch (error) {
    console.error('Offer generation error:', error);
    return generateFallbackOffer(offerData, pricingAnalysis);
  }
}

// Fallback pricing analysis
function getDefaultPricingAnalysis() {
  return {
    recommendedPrice: "$997",
    priceJustification: "This price point balances accessibility with perceived value, using psychological pricing ($997 vs $1000)",
    valueStackTotal: "$2,497",
    pricingStrategy: "psychology-based",
    improvements: ["Add payment plan option", "Create higher-tier alternative"],
    psychologyTips: ["Use charm pricing ($X97)", "Show value comparison"],
    confidenceScore: 7,
    alternativePricing: [
      {"model": "One-time", "price": "$997", "pros": ["Immediate payment", "Higher profit margin"], "cons": ["Higher barrier to entry"]},
      {"model": "Payment plan", "price": "3x $397", "pros": ["Lower barrier to entry", "Higher total value"], "cons": ["Payment processing complexity"]}
    ]
  };
}

// Fallback offer generation
function generateFallbackOffer(offerData, pricingAnalysis) {
  return `🚀 TRANSFORM YOUR RESULTS TODAY

${offerData.dreamOutcome}

HERE'S EVERYTHING YOU GET:
• The complete system that makes this transformation possible
• Step-by-step implementation guidance
• ${offerData.bonus}

VALUE BREAKDOWN:
• Main Program: $1,497
• Bonus Package: $997
• Support & Guidance: $497
─────────────────
TOTAL VALUE: ${pricingAnalysis.valueStackTotal}

YOUR INVESTMENT: ${pricingAnalysis.recommendedPrice}
(You save over $1,500!)

🛡️ OUR IRON-CLAD GUARANTEE:
${offerData.guarantee}

⏰ LIMITED TIME: This special pricing ends soon!

[SECURE YOUR SPOT NOW]`;
}

// Original assembly function (legacy compatibility)
function assembleOffer(req, res) {
  const { dreamOutcome, guarantee, bonus, bonuses, price } = req.body;

  // Handle both 'bonus' (single string from frontend) and 'bonuses' (array from API spec)
  const bonusValue = bonus || bonuses;

  if (!dreamOutcome || !guarantee || !bonusValue || !price) {
    return res.status(400).json({ 
      error: 'Missing required fields: dreamOutcome, guarantee, bonus/bonuses, and price.' 
    });
  }

  // Handle both string and array formats for bonuses
  let bonusText;
  if (Array.isArray(bonusValue)) {
    bonusText = new Intl.ListFormat('en', { style: 'long', type: 'conjunction' }).format(bonusValue);
  } else {
    bonusText = bonusValue;
  }

  const finalOfferText = `Here's what you're going to get: You will ${dreamOutcome}. This is backed by our ${guarantee}. You will also receive these exclusive bonuses: ${bonusText}. The investment for this is ${price}.`;

  res.json({ finalOfferText });
}

// New AI-powered pricing analysis endpoint
async function analyzePricing(req, res) {
  try {
    const { pricingDescription, offerData } = req.body;
    
    if (!pricingDescription || !offerData) {
      return res.status(400).json({ error: 'Pricing description and offer data required' });
    }

    console.log('Analyzing pricing strategy:', pricingDescription);

    const analysis = await analyzePricingStrategy(pricingDescription, offerData);
    
    res.json({ analysis });
  } catch (error) {
    console.error('Pricing analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze pricing strategy' });
  }
}

// New premium offer assembly endpoint
async function assemblePremiumOffer(req, res) {
  try {
    const { offerData, pricingAnalysis } = req.body;
    
    if (!offerData || !pricingAnalysis) {
      return res.status(400).json({ error: 'Offer data and pricing analysis required' });
    }

    console.log('Generating premium offer with AI-powered pricing');

    const premiumOffer = await generatePremiumOffer(offerData, pricingAnalysis);
    
    res.json({ finalOfferText: premiumOffer });
  } catch (error) {
    console.error('Premium offer assembly error:', error);
    res.status(500).json({ error: 'Failed to generate premium offer' });
  }
}

module.exports = { 
  assembleOffer,
  analyzePricing,
  assemblePremiumOffer
};