const express = require('express');
const router = express.Router();
const requireAuth = require('../Middleware/requireAuth');
const { login , getAlluserController, getUserroleItemsController, postUser, getRoleOptioncontroller} =  require("../controller/userController");
router.get('/', getAlluserController);
router.get('/roleoption', getRoleOptioncontroller);

router.post('/login',login);
router.get('/roleitems', requireAuth,getUserroleItemsController);
router.post('/post', requireAuth, postUser);


module.exports = router;