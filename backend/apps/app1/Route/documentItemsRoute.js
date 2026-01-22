const express = require('express');
const {getDocumentitems} = require('../Controller/documentItem');

const router = express.Router();

router.get('/drawingitemRequestexisting/documentitems', getDocumentitems);

module.exports = router;
