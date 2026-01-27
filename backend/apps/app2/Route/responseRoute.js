const express = require('express');
const responseController = require('../Controller/responseController');
const router = express.Router();

router.get('/drawingResponse', responseController.getAllresponseController);
router.post('/printdrawingRequest/post', responseController.postResponsecontrroller);

module.exports = router;