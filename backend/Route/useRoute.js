const express = require('express');
const router = express.Router();
const { getUsers, login } =  require("../controller/userController");

router.get('/',getUsers);
router.post('/login',login);


module.exports = router;