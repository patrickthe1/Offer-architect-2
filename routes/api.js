const express = require('express');
const { generateDreamOutcome, getGuidedQuestions } = require('../controllers/dreamOutcomeController');
const { generateGuarantees } = require('../controllers/guaranteeController');
const { generateBonuses } = require('../controllers/bonusController');
const { assembleOffer } = require('../controllers/offerController');

const router = express.Router();

// Dream Outcome endpoints
router.post('/dream-outcome', generateDreamOutcome);
router.get('/dream-outcome/questions', getGuidedQuestions);

// Other endpoints
router.post('/guarantees', generateGuarantees);
router.post('/bonuses', generateBonuses);
router.post('/assemble-offer', assembleOffer);

module.exports = router;