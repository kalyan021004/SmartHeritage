const mongoose = require("mongoose");
const Site = require("../models/Site");

const MONGO_URI =

/* ALL NEW TOUR LINKS */

const TOUR_UPDATES = [
  {
    slug: "murudeshwar-temple,-statue-of-lord-shiva",
    url: "https://www.p4panorama.com/panos/murudeshwar-temple-360-degree-virtual-reality-tour/",
    label: "360 Virtual Tour"
  }

  


];

async function updateTours() {
  try {
    await mongoose.connect(MONGO_URI);

    console.log("✅ Connected to MongoDB");

    for (const tour of TOUR_UPDATES) {
      console.log("\nProcessing:", tour.slug);

      const site = await Site.findOne({
        slug: tour.slug
      });

      if (!site) {
        console.log("❌ Site NOT FOUND:", tour.slug);
        continue;
      }

      console.log("✅ Site found:", site.name);

      /* DELETE old links */

      await Site.updateOne(
        { slug: tour.slug },
        {
          $set: {
            virtual_tour_links: []
          }
        }
      );

      console.log("🗑 Old links removed");

      /* ADD new link */

      await Site.updateOne(
        { slug: tour.slug },
        {
          $push: {
            virtual_tour_links: {
              url: tour.url,
              type: "unknown",
              label: tour.label
            }
          }
        }
      );

      console.log("🚀 Tour added");
    }

    console.log("\n🎉 All updates completed");

  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    await mongoose.disconnect();

    console.log("🔌 Disconnected from MongoDB");
  }
}

updateTours();