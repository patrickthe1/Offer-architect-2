const express = require('express');
const { generateDreamOutcome, getGuidedQuestions } = require('../controllers/dreamOutcomeController');
const { generateGuarantees, getGuidedQuestions: getGuaranteeQuestions } = require('../controllers/guaranteeController');
const { generateBonuses, getBonusQuestions, generateGuidedBonuses } = require('../controllers/bonusController');
const { assembleOffer, analyzePricing, assemblePremiumOffer } = require('../controllers/offerController');

const router = express.Router();

// Dream Outcome endpoints
router.post('/dream-outcome', generateDreamOutcome);
router.get('/dream-outcome/questions', getGuidedQuestions);

// Guarantee endpoints
router.post('/guarantees', generateGuarantees);
router.get('/guarantees/questions', getGuaranteeQuestions);

// Bonus endpoints
router.post('/bonuses', generateBonuses);
router.get('/bonuses/questions', getBonusQuestions);
router.post('/bonuses/guided', generateGuidedBonuses);

// Offer Assembly endpoints
router.post('/assemble-offer', assembleOffer);
router.post('/analyze-pricing', analyzePricing);
router.post('/assemble-premium-offer', assemblePremiumOffer);

module.exports = router;