const express = require('express');
const { generateDreamOutcome } = require('../controllers/dreamOutcomeController');
const { generateGuarantees } = require('../controllers/guaranteeController');
const { generateBonuses } = require('../controllers/bonusController');

const router = express.Router();

router.post('/dream-outcome', generateDreamOutcome);
router.post('/guarantees', generateGuarantees);
router.post('/bonuses', generateBonuses);

module.exports = router;
