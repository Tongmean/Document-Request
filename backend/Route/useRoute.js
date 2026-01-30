const express = require('express');
const router = express.Router();
const { login , getAlluserController} =  require("../controller/userController");

router.get('/', getAlluserController);
router.post('/login',login);


module.exports = router;