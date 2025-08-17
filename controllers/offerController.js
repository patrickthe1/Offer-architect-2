function assembleOffer(req, res) {
  const { dreamOutcome, guarantee, bonuses, price } = req.body;

  if (!dreamOutcome || !guarantee || !bonuses || !Array.isArray(bonuses) || bonuses.length === 0 || !price) {
    return res.status(400).json({ error: 'Missing required fields: dreamOutcome, guarantee, bonuses (must be a non-empty array), and price.' });
  }

  // A more robust way to join the bonuses array into a natural list
  const bonusText = new Intl.ListFormat('en', { style: 'long', type: 'conjunction' }).format(bonuses);

  const finalOfferText = `Here's what you're going to get: You will ${dreamOutcome}. This is backed by our ${guarantee}. You will also receive these exclusive bonuses: ${bonusText}. The investment for this is ${price}.`;

  res.json({ finalOfferText });
}

module.exports = { assembleOffer };