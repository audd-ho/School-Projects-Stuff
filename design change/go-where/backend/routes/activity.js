const express = require('express');
const router = express.Router();
const ActivityController = require('../controllers/activity');

router.post('/start/', ActivityController.start);
router.get('/getPhoto/photoRef=:photoRef', ActivityController.getPhoto);
router.get('/getDetails/place_id=:place_id', ActivityController.getDetails);

module.exports = router;