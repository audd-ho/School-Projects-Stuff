const express = require('express')
const router = express.Router()
const schemas = require('../models/schemas')
const mongoose = require('mongoose')
const UserController = require('../controllers/user');
const GroupController = require('../controllers/group');

var bodyParser = require('body-parser')

var jsonParser = bodyParser.json()

router.post('/', jsonParser, GroupController.GroupLayout);
router.post('/GetUser', jsonParser, UserController.getUserFromID);
router.post('/GetGroup', jsonParser, GroupController.getGroupFromID);

module.exports = router;