const mongoose = require("mongoose");

const Site = require('../models/Site');

async function deleteStateSites() {

  try {

    await mongoose.connect(
    );

    const stateName = "Telangana"; // change state here

    const result = await Site.deleteMany({
      "location.state": stateName
    });

    console.log(
      "Deleted sites:",
      result.deletedCount
    );

    process.exit();

  }

  catch (err) {

    console.error(err);

  }

}

deleteStateSites();