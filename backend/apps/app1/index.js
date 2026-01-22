const express = require('express');
const drawingRequestRoutes = require('./Route/Drawing_Request_Route');
const drawingitemRequestRoutes = require('./Route/Drawing_Request_Item_Route');
const documentitemRequestRoutes = require('./Route/documentItemsRoute');

const drawingResponseRoutes = require('./Route//Drawing_ResponseRoute');
const router = express.Router();

router.use('/', drawingRequestRoutes);
router.use('/', drawingitemRequestRoutes);
router.use('/', documentitemRequestRoutes);

router.use('/', drawingResponseRoutes);

module.exports = router;
