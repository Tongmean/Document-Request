const express = require('express');
const router = express.Router();
const requireAuth = require('../Middleware/requireAuth');
const {updatedUsercontroller, login , getAlluserController, getUserroleItemsController, postUser, getRoleOptioncontroller, getUserandroleitemsbyuser_id} =  require("../controller/userController");
router.get('/', getAlluserController);
router.get('/roleoption', getRoleOptioncontroller);

router.post('/login',login);
router.get('/roleitems', requireAuth,getUserroleItemsController);
router.post('/post', requireAuth, postUser);
router.post('/', requireAuth, getUserandroleitemsbyuser_id);
router.post('/update', requireAuth, updatedUsercontroller);


module.exports = router;