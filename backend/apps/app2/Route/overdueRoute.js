const express = require('express');
const overdueController = require('../Controller/overdueController');

const router = express.Router();

router.post('/drawingOverdue/followup', overdueController.postFollowFormController);
router.post('/drawingOverdue/overdueform', overdueController.postOverdueController);

module.exports = router;