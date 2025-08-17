const express = require('express');
const { generateDreamOutcome } = require('../controllers/dreamOutcomeController');

const router = express.Router();

router.post('/dream-outcome', generateDreamOutcome);

module.exports = router;
