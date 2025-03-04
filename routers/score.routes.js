const express = require('express')
const { storeScore, fetchAllScore, fetchSingleScore } = require('../controllers/score.controllers');
const router = express.Router()


// store score
router.post('/', storeScore)

// get score
router.get('/', fetchAllScore)

// fetch single score
router.get('/:userId', fetchSingleScore)

module.exports = router;