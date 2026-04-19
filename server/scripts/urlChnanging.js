const mongoose = require("mongoose");
const Site = require("../models/Site");

async function updateTourLinks() {
  await mongoose.connect("mongodb+srv://venkat02kalyan_db_user:1sRMLEPs1VLWZfEX@cluster0.7ad5ldb.mongodb.net/?appName=Cluster0");

  const sites = await Site.find();

  for (const site of sites) {

    let updated = false;

    site.virtual_tour_links.forEach(link => {

      if (
        link.url &&
        link.url.startsWith(
          "https://www.tamilnadutourism.tn.gov.in"
        )
      ) {
        link.isIframe = false;
        updated = true;
      } else {
        link.isIframe = true;
        updated = true;
      }

    });

    if (updated) {
      await site.save();
      console.log(
        "Updated:",
        site.name
      );
    }

  }

  console.log("DONE");
  process.exit();
}

updateTourLinks();