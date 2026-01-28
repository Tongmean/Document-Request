const express = require('express');
const processController = require('../Controller/processController');

const router = express.Router();

// router.get('/drawingApprove', approveController.approveController);
router.post('/drawingProcess/post', processController.postProcessform);

module.exports = router;