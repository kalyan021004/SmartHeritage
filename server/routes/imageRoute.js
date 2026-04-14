const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {

  try {

    const query = req.query.query;

    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${query}&per_page=8&client_id=${process.env.UNSPLASH_KEY}`
    );

    const data = await response.json();

    const images = data.results.map(img => img.urls.regular);

    res.json({
      images
    });

  }

  catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Image fetch failed"
    });

  }

});

module.exports = router;