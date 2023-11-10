const express = require('express')
const router = express.Router()
const schemas = require('../models/schemas')
const mongoose = require('mongoose')
const UserController = require('../controllers/user');
const GroupController = require('../controllers/group');

let bodyParser = require('body-parser')

let jsonParser = bodyParser.json()

router.post("/", jsonParser, GroupController.createGroup)

module.exports = router;