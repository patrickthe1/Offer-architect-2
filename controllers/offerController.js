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

module.exports = { assembleOffer };