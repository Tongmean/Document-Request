const express = require('express');
const requestController = require('../Controller/requestController');
const printRequestController = require('../Controller/printRequestcontroller');
const router = express.Router();

router.get('/drawingRequest', requestController.requestController);
router.post('/printdrawingRequest', printRequestController.printRequestController);

module.exports = router;