const express = require('express');
const router = express.Router();
const Site = require('../models/Site');
const {
  searchSites,
  getAllSites,
  getSiteBySlug,
  generateSite,
  getSiteSection
} = require('../controllers/siteController');

router.get('/search',    searchSites);
router.get('/all',       getAllSites);
router.post('/generate', generateSite);

router.get('/bystate', async (req, res) => {
  try {
    const { state } = req.query;

    let filter = {};
    if (state) {
      filter["location.state"] = state;
    }

    const sites = await Site.find(filter);

    res.json({
      success: true,
      count: sites.length,
      data: sites
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
router.get('/:slug',     getSiteBySlug);
router.get('/:slug/:section', getSiteSection);


module.exports = router;