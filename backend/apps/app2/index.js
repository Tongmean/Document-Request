const express = require('express');
const drawingRequestRoutes = require('./Route/requestRoute');
const drawingRequestItemRoutes = require('./Route/responseRoute');
const drawingApprove = require('./Route/approveRoute');
const drawingSender = require('./Route/senderRoute');
const router = express.Router();
router.use('/', drawingRequestRoutes);
router.use('/', drawingRequestItemRoutes);
router.use('/', drawingApprove);
router.use('/', drawingSender);

module.exports = router;
