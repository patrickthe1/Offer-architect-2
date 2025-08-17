const express = require('express');
const { generateDreamOutcome, getGuidedQuestions } = require('../controllers/dreamOutcomeController');
const { generateGuarantees, getGuidedQuestions: getGuaranteeQuestions } = require('../controllers/guaranteeController');
const { generateBonuses, getBonusQuestions, generateGuidedBonuses } = require('../controllers/bonusController');
const { assembleOffer } = require('../controllers/offerController');

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

// Other endpoints
router.post('/assemble-offer', assembleOffer);

module.exports = router;