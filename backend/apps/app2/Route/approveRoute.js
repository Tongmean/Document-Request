const express = require('express');
const approveController = require('../Controller/approveController');

const router = express.Router();

router.get('/drawingApprove', approveController.approveController);

module.exports = router;