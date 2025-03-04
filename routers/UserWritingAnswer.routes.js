const express = require('express')
const { addWritingAnswer } = require('../controllers/UserWritingAnswer.controllers')
const router = express.Router()


// add user writing answer
router.post('/submit', addWritingAnswer)









module.exports = router;