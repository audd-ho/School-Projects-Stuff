const express = require('express');
const router = express.Router();
const ActivityController = require('../controllers/activity');

var bodyParser = require('body-parser')

var jsonParser = bodyParser.json()

router.post("/Initialise", jsonParser, ActivityController.InitialisePage)
router.get("/VoteSetUp", jsonParser, ActivityController.VoteInitialise)
router.post("/CastVote", jsonParser, ActivityController.Vote)
router.post("/Back", jsonParser, ActivityController.ClearActivityData)



module.exports = router;