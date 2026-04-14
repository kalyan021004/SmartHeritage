const mongoose = require("mongoose");

const Site = require('../models/Site');

async function deleteStateSites() {

  try {

    await mongoose.connect(
      "mongodb+srv://venkat02kalyan_db_user:1sRMLEPs1VLWZfEX@cluster0.7ad5ldb.mongodb.net/?appName=Cluster0"
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