const express = require('express');
const senderController = require('../Controller/senderController');
const router = express.Router();

router.get('/drawingSender', senderController.getAllsenderController);
router.post('/drawingSender/post', senderController.postSendercontroller);

module.exports = router;