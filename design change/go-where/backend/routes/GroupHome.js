const express = require('express')
const router = express.Router()
const schemas = require('../models/schemas')
const mongoose = require('mongoose')
const UserController = require('../controllers/user');
const GroupController = require('../controllers/group');

var bodyParser = require('body-parser')

var jsonParser = bodyParser.json()

router.get('/RT:GroupID', jsonParser, GroupController.getRTGroupUsers_MDT);
router.post('/Selected', jsonParser, GroupController.setChosenDetails);
router.post('/Preferences', jsonParser, GroupController.findActivities);

module.exports = router;