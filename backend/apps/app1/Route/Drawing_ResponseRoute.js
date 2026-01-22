const express = require('express');
const controller = require('../Controller/Drawing_Response_Controller');

const router = express.Router();

router.get('/drawingResponseexisting', controller.getalldrawingresponse_existing);
router.post('/drawingResponseexistingbyid', controller.getalldrawingresponse_existingbyid);
router.post('/drawingResponseexisting/create', controller.createDrawingresponse);
router.post('/drawingResponseexistingurlbyid', controller.getUrlbyid);

module.exports = router;
