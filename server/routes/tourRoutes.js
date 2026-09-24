const express = require('express');
const router = express.Router();
const { narrateHotspot } = require('../controllers/tourController');

router.post('/narrate', narrateHotspot);

module.exports = router;