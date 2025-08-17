const express = require('express');
const { generateDreamOutcome } = require('../controllers/dreamOutcomeController');
const { generateGuarantees } = require('../controllers/guaranteeController');

const router = express.Router();

router.post('/dream-outcome', generateDreamOutcome);
router.post('/guarantees', generateGuarantees);

module.exports = router;
