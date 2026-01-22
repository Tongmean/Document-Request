const express = require('express');
const controller = require('../Controller/Drawing_Request_Controoler');

const router = express.Router();

router.get('/drawingRequestexisting', controller.getalldrawingrequest_existing);
router.post('/drawingRequestexistingbyid/', controller.getalldrawingrequest_existingbyid);
router.post('/drawingRequestexisting/create', controller.createdrawingrequest_existing);
router.get('/drawingRequestexisting/reqestno', controller.getrquestno_existing);

module.exports = router;
