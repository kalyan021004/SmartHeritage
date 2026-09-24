const axios = require("axios");

const Site = require("../models/Site");

const generateImages = require("../lib/imageGenerator.js");


// ============================================================
// GET /api/sites/search?q=
// ============================================================

const searchSites = async (req, res) => {

  try {

    const q = req.query.q?.trim();

    if (!q) {
      return res.json({
        found_in_db: false,
        site: null
      });
    }

    const slug = q
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-");

    const site = await Site.findOne(
      { slug },
      {
        name: 1,
        slug: 1,
        location: 1,
        category: 1
      }
    );

    return res.json({
      found_in_db: !!site,
      site: site || null
    });

  } catch (err) {

    console.error("SEARCH ERROR:", err);

    return res.status(500).json({
      error: err.message
    });
  }
};


// ============================================================
// GET /api/sites/all
// ============================================================

const getAllSites = async (req, res) => {

  try {

    const sites = await Site.find(
      {},
      {
        name: 1,
        slug: 1,
        location: 1,
        category: 1,
        conservation_status: 1
      }
    );

    return res.json(sites);

  } catch (err) {

    console.error("GET ALL SITES ERROR:", err);

    return res.status(500).json({
      error: err.message
    });
  }
};


// ============================================================
// GET /api/sites/:slug
// ============================================================

const getSiteBySlug = async (req, res) => {

  try {

    const site = await Site.findOne({
      slug: req.params.slug
    });

    if (!site) {

      return res.status(404).json({
        error: "Site not found"
      });
    }

    return res.json(site);

  } catch (err) {

    console.error("GET SITE ERROR:", err);

    return res.status(500).json({
      error: err.message
    });
  }
};


// ============================================================
// POST /api/sites/generate
// ============================================================

const generateSite = async (req, res) => {

  try {

    const { place_name } = req.body;

    // --------------------------------------------------------
    // Validate
    // --------------------------------------------------------

    if (!place_name || !place_name.trim()) {

      return res.status(400).json({
        error: "place_name required"
      });
    }

    const cleanPlaceName = place_name.trim();


    // --------------------------------------------------------
    // Create slug
    // --------------------------------------------------------

    const slug = cleanPlaceName
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-");

    console.log("=================================");
    console.log("SITE GENERATION");
    console.log("Place:", cleanPlaceName);
    console.log("Slug:", slug);
    console.log("=================================");


    // --------------------------------------------------------
    // Check MongoDB first
    // --------------------------------------------------------

    const existing = await Site.findOne({
      slug
    });

    if (existing) {

      console.log(
        "Site already exists. Returning existing site."
      );

      return res.json(existing);
    }


    // --------------------------------------------------------
    // Check GenAI URL
    // --------------------------------------------------------

    if (!process.env.GENAI_SERVICE_URL) {

      return res.status(500).json({
        error: "GENAI_SERVICE_URL not configured"
      });
    }


    // --------------------------------------------------------
    // Call Python GenAI service
    // --------------------------------------------------------

    console.log(
      "Calling GenAI service..."
    );
    

    const response = await axios.post(

      `${process.env.GENAI_SERVICE_URL}/api/site/generate`,

      {
        place_name: cleanPlaceName,
        language:"en"
        
      },

      {
        headers: {
          "Content-Type": "application/json"
        },

        timeout: 120000
      }
    );


    console.log(
      "GenAI response received"
    );


    // --------------------------------------------------------
    // Get generated site JSON
    // --------------------------------------------------------

    let siteData = response.data;


    // --------------------------------------------------------
    // If Python returned JSON as a string
    // --------------------------------------------------------

    if (typeof siteData === "string") {

      try {

        siteData = siteData
          .replace(/^```json\s*/i, "")
          .replace(/^```\s*/i, "")
          .replace(/\s*```$/i, "")
          .trim();

        siteData = JSON.parse(siteData);

      } catch (error) {

        console.error(
          "Invalid JSON received from GenAI:"
        );

        console.error(siteData);

        return res.status(500).json({
          error: "AI returned invalid JSON"
        });
      }
    }


    // --------------------------------------------------------
    // Validate object
    // --------------------------------------------------------

    if (
      !siteData ||
      typeof siteData !== "object" ||
      Array.isArray(siteData)
    ) {

      return res.status(500).json({
        error: "Invalid site data from GenAI service"
      });
    }


    // --------------------------------------------------------
    // Force important fields
    // --------------------------------------------------------

    siteData.name = cleanPlaceName;

    siteData.slug = slug;

    siteData.data_source = "ai_generated";


    // --------------------------------------------------------
    // Ensure location
    // --------------------------------------------------------

    if (
      !siteData.location ||
      typeof siteData.location !== "object"
    ) {

      siteData.location = {
        city: "",
        state: "",
        country: "",
        lat: 0,
        lng: 0
      };
    }


    // --------------------------------------------------------
    // Ensure arrays
    // --------------------------------------------------------

    if (!Array.isArray(siteData.also_known_as)) {
      siteData.also_known_as = [];
    }

    if (!Array.isArray(siteData.architectural_highlights)) {
      siteData.architectural_highlights = [];
    }

    if (!Array.isArray(siteData.nearby_sites)) {
      siteData.nearby_sites = [];
    }

    if (!Array.isArray(siteData.virtual_tour_hotspots)) {
      siteData.virtual_tour_hotspots = [];
    }


    // --------------------------------------------------------
    // Ensure visitor_info
    // --------------------------------------------------------

    if (
      !siteData.visitor_info ||
      typeof siteData.visitor_info !== "object"
    ) {

      siteData.visitor_info = {
        timings: "",
        entry_fee: "",
        best_time_to_visit: "",
        how_to_reach: "",
        accessibility: ""
      };
    }


    // --------------------------------------------------------
    // Virtual tour links
    // --------------------------------------------------------

    if (!Array.isArray(siteData.virtual_tour_links)) {
      siteData.virtual_tour_links = [];
    }

    siteData.virtual_tour_links =
      siteData.virtual_tour_links
        .filter(Boolean)
        .map((link) => {

          if (typeof link === "string") {

            return {
              url: link,
              type: "external",
              label: "Virtual Tour"
            };
          }

          return {
            url: link.url || "",
            type: link.type || "external",
            label: link.label || "Virtual Tour"
          };
        });


    // --------------------------------------------------------
    // Remove invalid URLs
    // --------------------------------------------------------

    siteData.virtual_tour_links =
      siteData.virtual_tour_links.filter(
        (link) =>
          link.url &&
          /^https?:\/\//i.test(link.url)
      );


    // --------------------------------------------------------
    // Generate images
    // --------------------------------------------------------

    let images = [];

    try {

      console.log(
        "Generating images..."
      );

      images = await generateImages(
        cleanPlaceName
      );

      console.log(
        "Images generated:",
        images?.length || 0
      );

    } catch (imageError) {

      console.error(
        "Image generation failed:",
        imageError.message
      );

      images = [];
    }

    siteData.images = images || [];


    // --------------------------------------------------------
    // Save to MongoDB
    // --------------------------------------------------------

    console.log(
      "Saving site to MongoDB..."
    );

    const site = await Site.create(
      siteData
    );

    console.log(
      "Saved successfully"
    );


    // --------------------------------------------------------
    // Return same JSON to frontend
    // --------------------------------------------------------

    return res.json(site);

  } catch (err) {

    // --------------------------------------------------------
    // Duplicate slug
    // --------------------------------------------------------

    if (err.code === 11000) {

      const slug =
        req.body.place_name
          .toLowerCase()
          .trim()
          .replace(/\s+/g, "-");

      const existing =
        await Site.findOne({ slug });

      if (existing) {
        return res.json(existing);
      }
    }


    // --------------------------------------------------------
    // GenAI error
    // --------------------------------------------------------

    if (err.response) {

      console.error(
        "GENAI SERVICE ERROR:"
      );

      console.error(
        "Status:",
        err.response.status
      );

      console.error(
        "Data:",
        err.response.data
      );
    }


    console.error(
      "SITE GENERATION ERROR:",
      err
    );

    return res.status(500).json({
      error:
        err.response?.data?.detail ||
        err.message ||
        "Failed to generate site"
    });
  }
};


// ============================================================
// GET SITE SECTION
// ============================================================

// ============================================================
// GET /api/sites/:slug/:section
// ============================================================

const getSiteSection = async (req, res) => {

  try {

    const { slug, section } = req.params;

    console.log("=================================");
    console.log("SITE SECTION REQUEST");
    console.log("Slug:", slug);
    console.log("Section:", section);
    console.log("=================================");


    // ========================================================
    // FIND SITE
    // ========================================================

    let site;

    try {

      site = await Site.findOne({
        slug
      });

    } catch (dbError) {

      console.error(
        "DATABASE ERROR WHILE FINDING SITE:",
        dbError
      );

      return res.status(500).json({
        error: "Database error while finding site"
      });
    }


    if (!site) {

      return res.status(404).json({
        error: "Site not found"
      });
    }


    // ========================================================
    // MAP SECTION TO DATABASE FIELD
    // ========================================================

    const sectionFields = {

      history: "history_full",

      architecture: "architecture_full",

      culture: "culture_full",

      visitor: "visitor_full"

    };


    const fieldName =
      sectionFields[section];


    if (!fieldName) {

      return res.status(400).json({
        error: `Invalid section: ${section}`
      });
    }


    // ========================================================
    // RETURN EXISTING CONTENT
    // ========================================================

    if (site[fieldName]) {

      console.log(
        `Returning cached ${section} content`
      );

      return res.json({

        content: site[fieldName],

        keywords:
          `${site.name} ${section}`

      });
    }


    // ========================================================
    // CHECK GENAI SERVICE URL
    // ========================================================

    if (!process.env.GENAI_SERVICE_URL) {

      console.error(
        "GENAI_SERVICE_URL is not configured"
      );

      return res.status(500).json({
        error:
          "GenAI service URL is not configured"
      });
    }


    // ========================================================
    // CALL PYTHON GENAI SERVICE
    // ========================================================

    console.log(
      "Calling GenAI service for section..."
    );

    console.log(
      "URL:",
      `${process.env.GENAI_SERVICE_URL}/api/site/section`
    );


    let response;

    try {

      response = await axios.post(

        `${process.env.GENAI_SERVICE_URL}/api/site/section`,

        {
          site_name: site.name,
          section: section
        },

        {
          headers: {
            "Content-Type":
              "application/json"
          },

          timeout: 120000
        }
      );

    } catch (genaiError) {

      // ======================================================
      // PYTHON SERVICE ERROR
      // ======================================================

      console.error(
        "================================="
      );

      console.error(
        "GENAI SERVICE ERROR"
      );

      console.error(
        "Message:",
        genaiError.message
      );

      console.error(
        "Code:",
        genaiError.code
      );

      if (genaiError.response) {

        console.error(
          "Status:",
          genaiError.response.status
        );

        console.error(
          "Response:",
          genaiError.response.data
        );

      } else if (genaiError.request) {

        console.error(
          "No response received from GenAI service"
        );

      }

      console.error(
        "================================="
      );


      // IMPORTANT:
      // Return error instead of allowing it to
      // propagate further.

      return res.status(502).json({

        error:
          "GenAI service failed",

        details:
          genaiError.response?.data?.detail ||
          genaiError.message

      });
    }


    // ========================================================
    // VALIDATE PYTHON RESPONSE
    // ========================================================

    if (!response) {

      console.error(
        "GenAI returned no response"
      );

      return res.status(502).json({
        error:
          "No response from GenAI service"
      });
    }


    if (
      !response.data ||
      typeof response.data !== "object"
    ) {

      console.error(
        "Invalid response from GenAI:",
        response.data
      );

      return res.status(502).json({
        error:
          "Invalid response from GenAI service"
      });
    }


    // ========================================================
    // GET CONTENT
    // ========================================================

    const content =
      response.data.content;


    if (
      !content ||
      typeof content !== "string"
    ) {

      console.error(
        "GenAI returned invalid content:",
        response.data
      );

      return res.status(502).json({
        error:
          "GenAI returned empty or invalid section content"
      });
    }


    // ========================================================
    // SAVE TO DATABASE
    // ========================================================

    try {

      site[fieldName] =
        content;

      await site.save();

      console.log(
        `Saved ${section} content successfully`
      );

    } catch (dbError) {

      console.error(
        "DATABASE SAVE ERROR:",
        dbError
      );

      // We already have valid generated content.
      // Return it even if saving failed.

      return res.status(200).json({

        content,

        keywords:
          `${site.name} ${section}`,

        warning:
          "Content generated successfully but could not be saved to database"

      });
    }


    // ========================================================
    // SUCCESS
    // ========================================================

    console.log(
      `Section ${section} generated successfully`
    );


    return res.status(200).json({

      content,

      keywords:
        `${site.name} ${section}`

    });


  } catch (error) {

    // ========================================================
    // FINAL SAFETY NET
    // ========================================================

    console.error(
      "================================="
    );

    console.error(
      "UNEXPECTED SITE SECTION ERROR"
    );

    console.error(
      error
    );

    console.error(
      "================================="
    );


    // Make absolutely sure we don't try
    // to send another response.

    if (res.headersSent) {

      console.error(
        "Headers already sent. Cannot send error response."
      );

      return;
    }


    return res.status(500).json({

      error:
        "Unexpected error while generating site section",

      details:
        error.message

    });
  }
};


module.exports = {
  searchSites,
  getAllSites,
  getSiteBySlug,
  generateSite,
  getSiteSection
};