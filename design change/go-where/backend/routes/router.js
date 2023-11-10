const express = require('express')
const router = express.Router()
const schemas = require('../models/schemas')
const mongoose = require('mongoose')

router.get('/', function (req, res) {
    res.end(JSON.stringify("finally!"));
})


router.post('/group', async(req, res) => {

    const code = Math.random().toString(36).substring(2,7);
    const codeExists = await schemas.Groups.findOne({groupCode: code});

    while (codeExists) {
        code = Math.random().toString(36).substring(2,7);
        codeExists = await schemas.Groups.findOne({groupCode: code});
    }

    const newGroup = new schemas.Groups({
        groupName: req.body.groupName,
        groupCode: code,
        meetDateTime: req.body.meetDateTime})
    const saveGroup = await newGroup.save()
    if (saveGroup) {
        res.send(newGroup)
    }

    res.end()
})

module.exports = router