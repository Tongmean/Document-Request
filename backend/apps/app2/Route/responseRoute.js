const express = require('express');
const responseController = require('../Controller/responseController');
const router = express.Router();

router.get('/drawingResponse', responseController.getAllresponseController);
router.post('/drawingResponse/post', responseController.postResponsecontrroller);
router.post('/drawingResponse/checkform/post', responseController.postCheckformController);
// router.post('/printdrawingRequest/post', responseController.postResponsecontrroller);

module.exports = router;