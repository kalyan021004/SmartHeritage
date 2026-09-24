const express = require('express');
const router  = express.Router();
const isLoggedIn=require('../middlewares/isLoggedIn')
const { chatWithSite } = require('../controllers/chatController');

router.post('/', isLoggedIn ,chatWithSite);

module.exports = router;