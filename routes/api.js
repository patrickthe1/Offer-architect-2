const express = require('express');
const { generateDreamOutcome } = require('../controllers/dreamOutcomeController');
const { generateGuarantees } = require('../controllers/guaranteeController');
const { generateBonuses } = require('../controllers/bonusController');
const { assembleOffer } = require('../controllers/offerController');

const router = express.Router();

router.post('/dream-outcome', generateDreamOutcome);
router.post('/guarantees', generateGuarantees);
router.post('/bonuses', generateBonuses);
router.post('/assemble-offer', assembleOffer);

module.exports = router;