const express = require('express');
const requestController = require('../Controller/requestController');
const printRequestController = require('../Controller/printRequestcontroller');
const router = express.Router();

router.get('/drawingRequest', requestController.requestController);
router.get('/drawingRequest/nextRequest_no', requestController.getRequest_no);
router.post('/printdrawingRequest', printRequestController.printRequestController);
router.post('/postdrawingRequest', requestController.postRequest);
router.post('/drawingRequestdateItems', requestController.getRequestdateItems);

module.exports = router;