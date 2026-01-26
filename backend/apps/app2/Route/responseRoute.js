const express = require('express');
const responseController = require('../Controller/responseController');
const router = express.Router();

router.get('/drawingResponse', responseController.getAllresponseController);
// router.post('/printdrawingRequest', printRequestController.printRequestController);

module.exports = router;